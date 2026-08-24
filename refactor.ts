import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

project.addSourceFilesAtPaths("src/**/*.ts");
project.addSourceFilesAtPaths("src/**/*.tsx");

function toPascalCase(s: string) {
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

const servicesDir = project.getDirectory("src/services");
const services = servicesDir?.getDirectories().filter(d => d.getBaseName() !== "base") || [];
console.log(`Found ${services.length} services`);

async function run() {
    for (const service of services) {
        const serviceName = service.getBaseName();
        const pascalName = toPascalCase(serviceName);
        console.log(`Processing ${serviceName}...`);

        const indexFile = service.getSourceFile("index.ts") || service.createSourceFile("index.ts", "", { overwrite: true });
        indexFile.replaceWithText(`export * from './hooks/use${pascalName}CRUD';\nexport * from './response/${pascalName}Response';\nexport * from './schema/${pascalName}Schema';\n`);

        const processDir = (dirName: string, targetName: string) => {
            const dir = service.getDirectory(dirName);
            if (!dir) return null;
            const files = dir.getSourceFiles().filter(f => f.getBaseName() !== targetName);
            if (files.length === 0) return dir.getSourceFile(targetName);

            const targetFile = dir.getSourceFile(targetName) || dir.createSourceFile(targetName, "", { overwrite: true });
            
            const allImports = new Map<string, Set<string>>(); 
            const defaultImports = new Map<string, string>();
            let bodyText = "";

            for (const file of files) {
                for (const imp of file.getImportDeclarations()) {
                    const mod = imp.getModuleSpecifierValue();
                    let resolvedMod = mod;
                    
                    if (mod.startsWith("../response/")) resolvedMod = `../response/${pascalName}Response`;
                    else if (mod.startsWith("../schema/")) resolvedMod = `../schema/${pascalName}Schema`;
                    else if (mod.startsWith("../hooks/")) resolvedMod = `../hooks/use${pascalName}CRUD`;
                    else if (mod.startsWith("./")) resolvedMod = `./${targetName.replace('.ts', '')}`; 

                    if (imp.getDefaultImport()) {
                        defaultImports.set(resolvedMod, imp.getDefaultImport()!.getText());
                    }
                    
                    if (!allImports.has(resolvedMod)) allImports.set(resolvedMod, new Set());
                    const set = allImports.get(resolvedMod)!;
                    for (const named of imp.getNamedImports()) {
                        set.add(named.getText());
                    }
                }
                
                const statements = file.getStatements().filter(s => s.getKind() !== SyntaxKind.ImportDeclaration);
                bodyText += statements.map(s => s.getText()).join("\n\n") + "\n\n";
            }

            allImports.delete(`./${targetName.replace('.ts', '')}`);

            let importText = "";
            for (const [mod, named] of allImports.entries()) {
                const def = defaultImports.get(mod);
                if (def && named.size > 0) {
                    importText += `import ${def}, { ${Array.from(named).join(", ")} } from "${mod}";\n`;
                } else if (def) {
                    importText += `import ${def} from "${mod}";\n`;
                } else if (named.size > 0) {
                    importText += `import { ${Array.from(named).join(", ")} } from "${mod}";\n`;
                }
            }

            targetFile.replaceWithText(importText + "\n" + bodyText);
            
            try { targetFile.organizeImports(); } catch (e) {}

            for (const file of files) {
                file.delete();
            }
            
            return targetFile;
        };

        processDir("response", `${pascalName}Response.ts`);
        processDir("schema", `${pascalName}Schema.ts`);
        processDir("hooks", `use${pascalName}CRUD.ts`);
    }

    console.log("Fixing imports globally...");
    const allFiles = project.getSourceFiles();
    
    for (const file of allFiles) {
        if (file.getFilePath().includes("/src/services/base/")) continue;
        let changed = false;
        
        for (const imp of file.getImportDeclarations()) {
            const mod = imp.getModuleSpecifierValue();
            const match = mod.match(/^@\/services\/([^\/]+)\/(hooks|response|schema)\/.*$/);
            if (match) {
                const serviceName = match[1];
                if (serviceName !== 'base') {
                    imp.setModuleSpecifier(`@/services/${serviceName}`);
                    changed = true;
                }
            }
        }
    }

    await project.save();
    console.log("Refactoring complete!");
}

run().catch(console.error);

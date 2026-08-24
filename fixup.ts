import * as fs from 'fs';
import * as path from 'path';
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
});
project.addSourceFilesAtPaths('src/**/*.ts');
project.addSourceFilesAtPaths('src/**/*.tsx');

const servicesDir = project.getDirectory('src/services');
const services = servicesDir?.getDirectories().filter(d => d.getBaseName() !== 'base') || [];

for (const service of services) {
    // Fix API_VERSION and default exports in hooks
    const hooksDir = service.getDirectory('hooks');
    if (hooksDir) {
        for (const file of hooksDir.getSourceFiles()) {
            let text = file.getFullText();

            // 1. Remove all export default statements like "export default useX;"
            text = text.replace(/^export default [\w]+;$/gm, '');

            // 2. Change "export default function useX" to "export function useX"
            text = text.replace(/export default function/g, 'export function');

            // 3. For arrow functions that were exported via "export default useX", we need to make sure they are exported.
            // But wait, if they are "const useX = ...", we can just add "export " before "const useX"
            text = text.replace(/^const use/gm, 'export const use');
            // Avoid "export export const"
            text = text.replace(/export export const/g, 'export const');

            // 4. Deduplicate API_VERSION
            let apiVersionCount = 0;
            text = text.replace(/const API_VERSION = ["']v1["'];/g, (match) => {
                apiVersionCount++;
                return apiVersionCount === 1 ? match : '';
            });

            // 5. Deduplicate other common constants
            const constsToDedupe = ['WA_API_URL', 'WA_API_KEY', 'WA_USER'];
            for (const c of constsToDedupe) {
                let count = 0;
                const regex = new RegExp(`const ${c} = [^;]+;`, 'g');
                text = text.replace(regex, (match) => {
                    count++;
                    return count === 1 ? match : '';
                });
            }

            file.replaceWithText(text);
        }
    }

    // Fix schema duplications in response
    const responseDir = service.getDirectory('response');
    if (responseDir) {
        for (const file of responseDir.getSourceFiles()) {
            let text = file.getFullText();

            // We need to deduplicate exact matches of "export const [Name]Schema = z.object({ ... })"
            // Since it might be multiline, it's easier to use ts-morph AST
            // Let's just find VariableStatements and deduplicate by name
            const varDecls = new Set<string>();
            for (const statement of file.getVariableStatements()) {
                for (const decl of statement.getDeclarations()) {
                    const name = decl.getName();
                    if (varDecls.has(name)) {
                        statement.remove();
                        break;
                    } else {
                        varDecls.add(name);
                    }
                }
            }
        }
    }

    // Fix schema duplications in schema
    const schemaDir = service.getDirectory('schema');
    if (schemaDir) {
        for (const file of schemaDir.getSourceFiles()) {
            const varDecls = new Set<string>();
            for (const statement of file.getVariableStatements()) {
                for (const decl of statement.getDeclarations()) {
                    const name = decl.getName();
                    if (varDecls.has(name)) {
                        statement.remove();
                        break;
                    } else {
                        varDecls.add(name);
                    }
                }
            }
        }
    }
}

// 6. Fix incorrect imports in features
// Since we removed 'export default', anywhere doing:
// import useX from '@/services/Y'
// Must become:
// import { useX } from '@/services/Y'
for (const file of project.getSourceFiles()) {
    if (file.getFilePath().includes('/src/services/')) continue;
    let changed = false;
    for (const imp of file.getImportDeclarations()) {
        const mod = imp.getModuleSpecifierValue();
        if (mod.startsWith('@/services/')) {
            const defaultImp = imp.getDefaultImport();
            if (defaultImp) {
                const name = defaultImp.getText();
                imp.removeDefaultImport();
                imp.addNamedImport(name);
                changed = true;
            }
        }
    }
}

project.saveSync();
console.log("Fixup complete");

import { ReactNode } from "react"
import { Label } from "./ui/label"

type Props = React.ComponentProps<typeof Label> & {
    children: ReactNode,
    required?: boolean
}

const LabelComp = ({
    children,
    required,
    ...props
}: Props) => {
    return (
        <Label className="flex font-medium capitalize gap-2 mb-2" {...props}>
            <span>
                {children}
            </span>
            {
                required && (
                    <span className="text-red-500">*</span>
                )
            }
        </Label>
    )
}

export default LabelComp;
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

type CurrencyInputProps = {
    value: number;
    onChange: (val: number) => void;
    locale?: string; // ex: "id-ID", "en-US"
    currency?: string; // ex: "IDR", "USD"
    allowDecimal?: boolean;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
};

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
    value,
    onChange,
    locale = "id-ID",
    currency = "IDR",
    allowDecimal = false,
    placeholder,
    className,
    disabled,
}) => {
    const [rawInput, setRawInput] = useState("");

    const decimalSeparator = new Intl.NumberFormat(locale)
        .format(1.1)
        .replace(/\d/g, "");

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: allowDecimal ? 20 : 0, // don't cut decimal places user entered
        }).format(val);

    const parseToNumber = (val: string) => {
        // replace all except digits and decimal separator
        const regex = allowDecimal
            ? new RegExp(`[^\\d${decimalSeparator}]`, "g")
            : /\D/g;

        let clean = val.replace(regex, "");

        if (allowDecimal && val.includes(decimalSeparator)) {
            const [intPart, decimalPart] = val.split(decimalSeparator);
            clean =
                intPart.replace(/\D/g, "") +
                "." +
                (decimalPart?.replace(/\D/g, "") ?? "");
        }

        const num = allowDecimal ? parseFloat(clean) : parseInt(clean, 10);
        return isNaN(num) ? 0 : num;
    };

    useEffect(() => {
        // convert value into localized currency string for initial render
        setRawInput(formatCurrency(value));
    }, [value, locale, currency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setRawInput(input);

        const parsed = parseToNumber(input);
        onChange(parsed);
    };

    const handleBlur = () => {
        const parsed = parseToNumber(rawInput);
        setRawInput(formatCurrency(parsed));
    };

    const handleFocus = () => {
        // show unformatted number
        setRawInput(rawInput.replace(/[^\d.,]/g, ""));
    };

    return (
        <Input
            value={rawInput}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            inputMode={allowDecimal ? "decimal" : "numeric"}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
        />
    );
};

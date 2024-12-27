import { ChangeEventHandler, useCallback } from "react";

export interface FormInputProps {
    className?: string;
    title: string;
    value: string;
    onChangeValue: (value: string) => void;
    type?: React.HTMLInputTypeAttribute;
}

export const FormInput: React.FC<FormInputProps> = (props) => {
    const { className, title, value, onChangeValue, type } = props;
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
        onChangeValue(e.target.value);
    }, [onChangeValue]);
    return <div className={className}>
        <div className="text-xs font-medium text-header-text mb-0.5">{title}</div>
        <input className="border-2 border-input-border rounded min-w-[304px] h-10 text-sm font-medium px-2" value={value} type={type} onChange={onChange} />
    </div>;
}

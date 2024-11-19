type CustomSeparatorProps = {
    withText: boolean;
    text?: string;
    className?: string;
};

export const CustomSeparator = ({ withText, text, className } : CustomSeparatorProps) => {
    return (
    <div className="flex items-center justify-center w-full my-4">
        {withText ? (
            <>
            <div className="border-t border-gray-400 dark:border-white flex-grow"></div>
            <span className="px-2 text-gray-600 dark:text-white dark:font-bold">{text ? text : "DEFAULT"}</span>
            <div className="border-t border-gray-400 dark:border-white flex-grow"></div>
            </>
        ) : (
            <div className="border-t border-gray-400 dark:border-white flex-grow"></div>
        )}
    </div>)
}
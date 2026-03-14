// Archivo central de clases semánticas usando Tailwind
export const InputTheme = {
    colors: {
        bg: "bg-neutral-100 text-neutral-800 px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ",
        text: "text-neutral-900 dark:text-neutral-100",
        placeholder: "placeholder:text-neutral-500 dark:placeholder:text-neutral-400",
        state: {
            default: "border-neutral-200 hover:border-neutral-300 focus-within:ring-neutral-500/20 dark:focus-within:ring-neutral-100/20 dark:border-neutral-800",
            success: "border-green-500 focus-within:ring-green-500/20 dark:border-green-600",
            error: "border-red-500 focus-within:ring-red-500/20 dark:border-red-600",
        }
    },
    label: {
        text: {
            default: "text-neutral-900 dark:text-neutral-200",
            error: "text-red-500"
        }
    }
};

export const LabelTheme = {
    colors: {
        text: {
            default: "text-neutral-900 dark:text-neutral-200",
            error: "text-red-500"
        }
    }
};

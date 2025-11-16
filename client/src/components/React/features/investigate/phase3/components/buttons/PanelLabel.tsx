
interface PanelLabel {
    description: string | null
};

export default function PanelLabel({ description }: PanelLabel): JSX.Element | null {

    return (
        <p className="absolute lg:hidden -bottom-3 text-white font-light text-xs tracking-tight">{description}</p>
    )
}
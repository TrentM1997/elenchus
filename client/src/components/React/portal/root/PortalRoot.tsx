import ModalPipeline from "../pipelines/ModalPipeline";

function PortalRoot(): JSX.Element {

    return (
        <div
            id="portal-root"
            className="pointer-events-none fixed z-[800] inset-0 
            flex items-start justify-center"
        >
            <ModalPipeline />
        </div>
    );
};

export default PortalRoot;
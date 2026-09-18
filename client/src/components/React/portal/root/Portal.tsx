import ModalPipeline from "../pipelines/ModalPipeline";
import ToastPipeline from "../pipelines/ToastPipeline";

function Portal(): JSX.Element {
  return (
    <div
      id="portal-root"
      className="pointer-events-none fixed z-[800] inset-0 
            flex items-start justify-center"
    >
      <ModalPipeline />
      <ToastPipeline />
    </div>
  );
}

export default Portal;

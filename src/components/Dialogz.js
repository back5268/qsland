import { Dialog } from "primereact/dialog";

const Dialogz = (props) => {
    const { title, visible, setVisible, position, width, ...prop } = props;

    return (
        <Dialog header={title} visible={visible} position={position || 'top'} style={{ width: width || '50vw' }}
            onHide={() => setVisible(false)} draggable={false} resizable={false} {...prop} >
            {props.children}
        </Dialog>
    )
}

export default Dialogz;
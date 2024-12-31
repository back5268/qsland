import { Tag as Tagz } from "primereact/tag"

const Tag = (props) => {
    const { severity, ...prop } = props
    let color = '#6366F1'
    switch (severity) {
        case "warning":
            color = '#F59E0B'
            break;
        case "success":
            color = '#22C55E'
            break;
        case "danger":
            color = '#EF4444'
            break;
        case "info":
            color = '#6366F1'
            break;
        default:
            break;
    }

    return (
        <Tagz style={{ color: color, backgroundColor: 'white', border: '1px solid ' + color, fontWeight: '800' }} {...prop} ></Tagz>
    )
}

export default Tag;
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';




function getPostActions(postUploaderId, currUserId, postId) {

    const actionsOpt1 = [
        {
            id: 1,
            content: 'Delete',
            label: 'Are you sure to delete the post?',
            icon: <DeleteForeverIcon fontSize="small" />,
            type: 'DELETE_POST',
            payload: postId

        }
    ]

    const actionOpt2 = [
        {
            id: 1,
            content: 'Block',
            label: 'Are you sure to block the user?',
            icon: <BlockIcon fontSize='small' />,
            type: 'BLOCK_USER',
            payload: postUploaderId

        },
        {
            id: 2,
            content: 'Report',
            label: 'Are you sure to report the post?',
            icon: <ReportIcon fontSize='small' />,
            type: 'REPORT_POST',
            payload: postId

        }
    ]

    return (postUploaderId == currUserId) ? actionsOpt1 : actionOpt2;
}

export default getPostActions;
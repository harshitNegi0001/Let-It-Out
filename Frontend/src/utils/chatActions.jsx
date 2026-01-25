import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';


export function getChatsActions(userId,isBlocked=false) {
    
    const chatActions = [
        {
            id: 1,
            content: `${isBlocked?'Unblock':'Block'}`,
            label: `Are you sure to ${isBlocked?'unblock':'block'} the user?`,
            icon: <BlockIcon fontSize='small' />,
            type: 'BLOCK_USER',
            payload: userId


        },
        {
            id: 2,
            content: 'Report',
            label: 'Are you sure to report the post?',
            icon: <ReportIcon fontSize='small' />,
            type: 'REPORT_USER',
            payload: userId

        },
        
    ]
    return chatActions
}
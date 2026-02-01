import BlockIcon from '@mui/icons-material/Block';


export function getChatsActions(userId,isBlocked=false) {
    
    const chatActions = [
        {
            id: 1,
            content: `${isBlocked?'Unblock':'Block'}`,
            label: `Are you sure to ${isBlocked?'unblock':'block'} the user?`,
            icon: <BlockIcon fontSize='small' />,
            type: 'BLOCK_USER',
            payload: userId


        }
        
    ]
    return chatActions
}
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BlockIcon from '@mui/icons-material/Block';
import ReportIcon from '@mui/icons-material/Report';
import { useDispatch } from 'react-redux';
import { setState } from '../store/authReducer/authReducer';
import axios from 'axios';



function getPostActions(dispatch,postUploaderId, currUserId,postId) {
    
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const actionsOpt1 = [
        {
            id: 1,
            content: 'Delete',
            label: 'Are you sure to delete the post?',
            icon: <DeleteForeverIcon fontSize="small" />,
            action: async () => {
                try {
                    const result =await axios.post(`${backend_url}/api/delete-post`,
                        {
                            postId
                        },
                        {
                            withCredentials:true,
                            headers:{
                                "Content-Type":'application/json'
                            }
                        }
                    );

                    dispatch(setState({success:'Post has been deleted.'}));



                } catch (err) {
                    dispatch(setState({error:err?.response?.data?.error||'Something went wrong!'}));
                    // console.log(err);
                }
            }

        }
    ]

    const actionOpt2 = [
        {
            id: 1,
            content: 'Block',
            label: 'Are you sure to block the user?',
            icon: <BlockIcon fontSize='small' />,
            action: async () => {
                // console.log(`blocked post with id =${postUploaderId}`);

            },

        },
        {
            id: 2,
            content: 'Report',
            label: 'Are you sure to report the post?',
            icon: <ReportIcon fontSize='small' />,
            action: async () => {

            }
        }
    ]

    return (postUploaderId==currUserId)?actionsOpt1:actionOpt2;
}

export default getPostActions;
import { useDispatch } from "react-redux"
import { setState } from "../store/authReducer/authReducer";
import axios from "axios";


const backend_url = import.meta.env.VITE_BACKEND_URL;

export const likeTarget = async (target,targetId,dispatch)=>{
    
    try {
        const result = await axios.post(
            `${backend_url}/like/like-target`,
            {
                targetId:targetId,
                targetName:target
            },
            {withCredentials:true}
        )

    } catch (err) {
        dispatch(setState({error:err?.response?.data?.error || "Something Went Wrong!"}));
        // console.log(err);
    }
}
export const deleteLikeTarget = async (target,targetId,dispatch)=>{
    
    try {
        const result = await axios.post(
            `${backend_url}/like/del-like-target`,
            {
                targetId:targetId,
                targetName:target
            },
            {withCredentials:true}
        )

    } catch (err) {
        dispatch(setState({error:err?.response?.data?.error || "Something Went Wrong!"}));
        // console.log(err);
    }
}
export const savePost = async (postId,dispatch)=>{
    
    try {
        const result = await axios.post(
            `${backend_url}/api/save-post`,
            {
                postId
            },
            {withCredentials:true}
        )

    } catch (err) {
        dispatch(setState({error:err?.response?.data?.error || "Something Went Wrong!"}));
        // console.log(err);
    }
}
export const undoSavedPost = async (postId,dispatch)=>{
    
    try {
        const result = await axios.post(
            `${backend_url}/api/undo-save-post`,
            {
                postId
            },
            {withCredentials:true}
        )

    } catch (err) {
        dispatch(setState({error:err?.response?.data?.error || "Something Went Wrong!"}));
        // console.log(err);
    }
}
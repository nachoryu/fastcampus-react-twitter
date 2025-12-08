import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import CommentForm from "components/comments/CommentForm";
import CommentBox, { CommentProps } from "components/comments/CommentBox";

export default function PostDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      onSnapshot(docRef, (doc) => {
        setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id });
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <div className="post__header">
        <button type="button" onClick={() => navigate(-1)}>
          <IoIosArrowBack className="post__header-btn" />
        </button>
      </div>
      {post ?
        <>
          <PostBox post={post} />
          <CommentForm post={post} />
          {post?.comments?.slice(0)?.reverse()?.map((data: CommentProps, index: number) => (
            <CommentBox key={index} data={data} post={post} />
          ))}
        </>
        :
        <Loader />

      }
    </div>
  )
}
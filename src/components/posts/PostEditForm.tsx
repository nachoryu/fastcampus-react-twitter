import { useCallback, useContext, useEffect, useState } from "react";
import { FiImage } from "react-icons/fi";
import { updateDoc, getDoc, doc } from "firebase/firestore";
import { db } from "firebaseApp";
import { toast } from "react-toastify";
import AuthContext from "context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { PostProps } from "pages/home";

export default function PostEditForm() {

  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [hashTag, setHashTag] = useState<string>("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getPost = useCallback(async() => {
    if(params.id) {
      const docRef = doc(db, "posts", params.id);
      const docSnap = await getDoc(docRef);
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap.id });
      setContent(docSnap?.data()?.content);
      setTags(docSnap?.data()?.hashTags);
    }
  }, [params.id]);

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() != '') {
      if (tags?.includes(e.target.value.trim())) {
        toast.error('같은 태그가 있습니다.') 
      } else {
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]))
        setHashTag("");
      }
    }
  }

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  }

  const removeTag = (tag: string) => {
    setTags(tags?.filter((val) => val !== tag));
  }

  const handleFileUpload = () => {};

  const onChange = (e :React.ChangeEvent<HTMLTextAreaElement>) => {
    const {target: { name, value }} = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          content: content,
          hashTags: tags,
        });
      }
      navigate(`/posts/${post?.id}`)
      toast.success("게시글이 수정되었습니다.")
    } catch (e: any) {
      console.log(e);
    }

  };

  useEffect(() => {
    if(params.id) {
      getPost();
    }
  }, [getPost]);

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea 
        className="post-form__textarea"
        required
        name="content"
        id="content"
        placeholder="What is happening?"
        onChange={onChange} 
        value={content}
      />
       <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {tags?.map((tag, index) => (
            <span className="post-form__hashtags-tag" key={index} onClick={() => removeTag(tag)}>#{tag}</span>
          ))}
        </span>
        <input 
          className="post-form__input" 
          name="hashtag" 
          id="hashtag" 
          placeholder="해시태그 + 스페이스 입력" 
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className="post-form__submit-area">
        <label htmlFor="file-input" className="post-from__file">
          <FiImage className="post-form__file-icon" />
        </label>
        <input type="file" name="file-input" accept="image/*" onChange={handleFileUpload} className="hidden" />
        <input type="submit" value="수정" className="post-form__submit-btn" />
      </div>
    </form>  
  );
}
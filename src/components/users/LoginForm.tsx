import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app } from "../../firebaseApp";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onClickSocialLogin = async (e: any) => {
    const { target: { name } } = e;

    let provider;
    const auth = getAuth(app);

    if (name === "google") {
      provider = new GoogleAuthProvider();
    }

    if (name === "github") {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(auth, provider as GithubAuthProvider | GoogleAuthProvider).then(
      (result) => {
        toast.success("로그인이 완료되었습니다.");
      }).catch((error) => {
        toast.error(error?.code);
      });

  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
      toast.success("로그인이 완료되었습니다.");
    } catch (error: any) {
      toast.error(error?.code);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;

    if (name === "email") {
      setEmail(value);
      const validRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      setPassword(value);
      if (value.length < 8) {
        setError("비밀번호는 8자리 이상이어야 합니다.");
      } else {
        setError("");
      }
    }
  };

  return (
    <form className="form form--lg" onSubmit={onSubmit} >
      <div className="form__title">로그인</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input type="email" id="email" name="email" value={email} required onChange={onChange} />
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input type="password" id="password" name="password" value={password} required onChange={onChange} />
      </div>
      {error && error?.length > 0 && (
        <div className="form__block">
          <div className="form__error">{error}</div>
        </div>
      )}
      <div className="form__block">
        계정이 없으신가요?
        <Link to="/users/signup" className="form__link">회원가입하기</Link>
      </div>
      <div className="form__block--lg">
        <button type="submit" className="form__btn--submit" disabled={error?.length > 0} >로그인</button>
      </div>
      <div className="form__block--lg">
        <button type="button" name="google" className="form__btn--google" onClick={onClickSocialLogin} disabled={error?.length > 0} >Google로 로그인</button>
      </div>
      <div className="form__block--lg">
        <button type="button" name="github" className="form__btn--github" onClick={onClickSocialLogin} disabled={error?.length > 0} >Github으로 로그인</button>
      </div>

    </form>
  );
}
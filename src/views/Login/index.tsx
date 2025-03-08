import { createSignal, onMount } from "solid-js";
import styles from "./index.module.css";
import { PicaApi2 } from "../../api/api";
import { getKVStorage, setKVStorage } from "minip-bridge";

export default function Login() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLogining, setIsLogining] = createSignal(false);
  const [msg, setMsg] = createSignal("");
  onMount(() => {
    const p1 = getKVStorage("username");
    const p2 = getKVStorage("password");
    getKVStorage("jwt")
      .then((res) => setMsg(res.data))
      .catch((err) => setMsg(String(err)));
    Promise.all([p1, p2]).then((arr) => {
      setUsername(arr[0].data);
      setPassword(arr[1].data);
    });
  });
  function login() {
    if (isLogining()) {
      return;
    }
    setIsLogining(true);
    const un = username();
    const pwd = password();
    if (un === "" || pwd === "") {
      return;
    }
    setKVStorage("username", un);
    setKVStorage("password", pwd);

    PicaApi2.Login(un, pwd)
      .then((res) => {
        if (res.code === 200 && res.data.token) {
          setKVStorage("jwt", res.data.token);
          setMsg(res.data.token);
        } else {
          throw new Error("request failed");
        }
      })
      .catch((err) => setMsg(err))
      .finally(() => setIsLogining(false));
  }
  return (
    <div class={styles.box}>
      <div>Login</div>
      <div
        style={{
          "word-break": "break-word",
        }}
      >
        {msg()}
      </div>
      <input
        class={styles.ipt}
        value={username()}
        onInput={(e) => setUsername(e.target.value)}
        type="text"
        autocomplete="off"
      />
      <input
        class={styles.ipt}
        value={password()}
        onInput={(e) => setPassword(e.target.value)}
        type="password"
        autocomplete="off"
      />
      <button disabled={isLogining()} class={styles.btn} onclick={login}>
        Login
      </button>
    </div>
  );
}

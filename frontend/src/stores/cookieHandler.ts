import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode, type JwtPayload } from 'jwt-decode'

export const useCookieHandler = defineStore('cookieHandler', () => {
  const utolsoDecoded = ref<JwtPayload>()
  function hasValidCookie() {
    const token = getCookie("alap");
    if (!token) return false;

    let decoded: JwtPayload;
    try {
      decoded = jwtDecode<JwtPayload>(token);
    } catch {
      return false;
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return false;
    }

    utolsoDecoded.value = decoded;
    return true;
  }


  const baseTime = ref(1800)
  const timeValue = ref(1800);
  const time = ref("00:00")

  let timer: ReturnType<typeof setInterval> | null = null;

  function startTimer() {
  const token = getCookie("alap");
  if (!token) return;

  let decoded: JwtPayload;
  try {
    decoded = jwtDecode<JwtPayload>(token);
  } catch {
    return;
  }

  if (decoded.exp) {
    baseTime.value = Math.floor((decoded.exp * 1000 - Date.now()) / 1000);
    timeValue.value = baseTime.value;
  }

  if (!timer) {
    timer = setInterval(() => {
      timeValue.value--;

      const perc = Math.floor(timeValue.value / 60);
      const masodperc = timeValue.value % 60;

      time.value =
        (perc < 10 ? "0" : "") +
        perc +
        ":" +
        (masodperc < 10 ? "0" : "") +
        masodperc;

      if (timeValue.value <= 0) {
        stopTimer();
        deleteCookie("alap");
      }
    }, 1000);
  }
}


  function stopTimer(){
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  function resetTimer(){
    stopTimer();
    timeValue.value = baseTime.value;
  };

  function setBaseTime(newTime:number){
    baseTime.value = newTime
  };

  function setCookie(cname:string, cvalue:string, date:Date) {
    let expires = "expires="+date.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
  function getCookie(cname:string) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      if(c!=undefined){
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
    }
    return "";
  }

  function deleteCookie(cname:string) {
    const d = new Date()
    d.setUTCFullYear(1970,1,1)
    setCookie(cname,"",d)
  }

  return { hasValidCookie,startTimer,resetTimer,time,setBaseTime,setCookie,getCookie,deleteCookie,utolsoDecoded }
})

<script setup>
import { ref, onMounted, watch, onBeforeMount } from "vue"
import api from "@/api";

// 二维码图片
const qrImg = ref('')

// 登录key
const loginKey = ref('')

// 轮询定时器，二维码扫码定时器
const qrCheckTimer = ref(null)

// 获取二维码登录的key
const fetchLoginKey = async () => {
    try {
        const res = await api.get("/login/qr/key")
        loginKey.value = res.data?.unikey || ''
    } catch (error) {
        console.log("获取二维码登录 key 失败", error);
        loginKey.value = ''
    }
}

// 根据 key 获取 二维码图片
const fetchQrImage = async (key) => {
    if (!key) return
    try {
        const res = await api.get("/login/qr/create", {
            key,
            timestamp: Date.now(),
            ua: "pc",
            qrimg: true
        })
        qrImg.value = res.data?.qrimg || ''
        
    } catch (error) {
        console.log("获取二维码图片失败");
        qrImg.value = ""
    }

}

// 轮询二维码状态，成功后保存用户信息
const startQrCheck = (key) =>{
    if(!key) return
    if(qrCheckTimer.value){
        clearInterval(qrCheckTimer.value)
    }
    qrCheckTimer.value = setInterval(async ()=>{
        // 网络请求
        const res = await api.get("/login/qr/check",{
            key,
            timestamp:Date.now(),
            ua:"pc"
        })
        // 常见状态：800 为二维码过期，801 为等待扫码，802 为待确定，803 为授权登录成功
        if(res.code === 803){
            clearInterval(qrCheckTimer.value)
            qrCheckTimer.value = null
        }

        // 授权成功之后，在调用 登录状态接口 获取用户完整信息
        const statusRes = await api.get("/login/status",{
            timestamp:Date.now(),
            ua:"pc"
        })
        console.log(statusRes);
        const profile = statusRes.data?.profile || statusRes.profile || statusRes.account
        console.log(profile);
        if(profile){
            
        }
    })
}



watch(
    () => loginKey.value,
    (val) => {
        if (val) {
            fetchQrImage(val)
        }
    }
)


onMounted(() => {
    fetchLoginKey()
})


</script>

<template>
    <div class="login-overlay">
        <div class="login-modal">
            <div class="login-header">
                <h2>扫描登陆网易云音乐</h2>
                <p>使用网易云音乐 APP 扫码登陆，更快捷更安全</p>
            </div>
            <div class="login-body">
                <div class="qrcode-box">
                    <div class="qrcode-placeholder">
                        <template v-if="qrImg">
                            <img :src="qrImg" alt="登录二维码">
                        </template>
                        <template v-else>
                            <span>二维码加载中..,</span>
                        </template>
                    </div>
                    <p class="qrcode-tip">打开网易云音乐 APP，扫一扫登录</p>
                </div>
                <ul class="login-features">
                    <li>同步收藏的歌单、歌曲和播放记录</li>
                    <li>多端同步，随时随地畅听音乐</li>
                    <li>更安全的扫码登录方式</li>
                </ul>
            </div>
        </div>
    </div>
</template>








<style scoped>
.login-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.login-modal {
    width: 420px;
    padding: 24px 32px 32px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
}

.login-header h2 {
    margin: 0;
    font-size: 20px;
    color: #333;
}

.login-header p {
    margin: 8px 0 0;
    font-size: 13px;
    color: #666;
}

.login-body {
    margin-top: 20px;
    display: flex;
    gap: 20px;
}

.qrcode-box {
    text-align: center;
}

.qrcode-placeholder {
    width: 140px;
    height: 140px;
    border-radius: 4px;
    background: #f5f5f5;
    border: 1px solid #e1e1e1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 14px;
}

.qrcode-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.qrcode-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
}

.login-features {
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 13px;
    color: #555;
}

.login-features li+li {
    margin-top: 8px;
}
</style>
<template>
    <div class="comment-drawer">
        <div class="drawer-mask" @click="$emit('update:visible', false)" @wheel.prevent></div>

        <div class="drawer-panel">
            <div class="panel-header">
                <h3>热门评论</h3>
                <span class="close-icon" @click="$emit('update:visible', false)">✕</span>
            </div>

            <ul class="comment-list">
                <li v-for="item in comments" :key="item.commentId" class="comment-item">
                    <div class="avatar-box">
                        <img :src="item.user?.avatarUrl + '?param=50y50'" alt="avatar" class="avatar-img">
                    </div>
                    <div class="content-box">
                        <div class="user-info">
                            <span class="nickname">{{ item.user?.nickname }}</span>
                            <span class="like-count">👍 {{ item.likedCount }}</span>
                        </div>
                        <div class="comment-text">
                            {{ item.content }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


<script setup>
import api from '@/api';
import { onMounted, ref } from 'vue'

// defineEmits({ 'update:visible': Function })
const emit = defineEmits(['update:visible'])
let props = defineProps({ 'songId': String })

const comments = ref([])

const getComment = async (id = "", limit = 10) => {
    if (!id) return
    try {
        let res = await api.get("/comment/music", { id, limit })

        console.log(res);
        comments.value = res.hotComments || res.comments || []

        console.log("comments", comments);
    } catch (error) {
        console.log("获取评论失败", error);
    }
}
// defineProps({ showComment: Function })
onMounted(() => {
    getComment(props.songId)
})

</script>

<style scoped>
.comment-drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    /* 面试考点：用 z-index 确保弹窗在最上层 */
    z-index: 999;

}

.drawer-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
}

.drawer-panel {
    position: absolute;
    top: 0;
    right: 0;
    width: 450px;
    /* 抽屉的宽度，你可以随便改 */
    height: 100%;
    background-color: #2b2b2b;
    /* 配合你播放器的暗黑主题 */
    color: #fff;
    /* padding: 20px; */
    /* box-sizing: border-box; */
    /* 面试考点：border-box 确保 padding 不会撑爆宽度 */
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
    /* 加点阴影，看起来更有立体感 */
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.5);
}

.panel-header {
    display: flex;
    justify-content: space-between; /* 标题和关闭按钮两端对齐 */
    align-items: center; /* 垂直居中 */
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* 加条底线分割 */
}

.panel-header h3 {
    margin: 0;
    font-size: 18px;
}

/* 关闭按钮样式 */
.close-icon {
    font-size: 20px;
    color: #999;
    cursor: pointer; /* 鼠标放上去变小手 */
    transition: color 0.2s;
}

.close-icon:hover {
    color: #fff; /* 悬浮变白 */
}

/* 评论列表容器 */
.comment-list {
    flex: 1; /* 占据剩余所有空间 */
    overflow-y: auto; /* 内容多了才出滚动条 */
    padding: 0 20px; /* 左右内边距 */
    margin: 0;
    list-style: none; /* 去掉 li 自带的小圆点 */
}

/* 隐藏滚动条（可选，让界面更清爽） */
.comment-list::-webkit-scrollbar {
    width: 6px;
}
.comment-list::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
}


.comment {
    display: flex;
}
/* 评论项容器：横向排列 */
.comment-item {
  display: flex;
  gap: 15px; /* 头像和文字的间距 */
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
}

/* 头像图片：设为圆形 */
.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

/* 右侧内容区：占据剩余全部空间，纵向排列 */
.content-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 昵称和点赞数所在行：两端对齐 */
.user-info {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 13px;
  color: #999;
}

/* 评论正文 */
.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #ddd;
}
</style>
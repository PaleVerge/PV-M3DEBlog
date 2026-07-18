<template>
        <md-list >
            <md-list-item>
                <h3>💻 欢迎来到 M3DEBlog——</h3>
            </md-list-item>
        
        <md-icon-button  aria-label="Search for Contact">
        <md-icon>settings</md-icon>
        </md-icon-button>

        <md-icon-button  aria-label="Search for Contact">
        <md-icon>delete </md-icon> 
        </md-icon-button>

        <md-icon-button  aria-label="Search for Contact">
        <md-icon>add </md-icon> 
        </md-icon-button>

        <md-icon-button  aria-label="Search for Contact">
        <md-icon> menu</md-icon> 
        </md-icon-button>

        <md-icon-button  aria-label="Search for Contact">
        <md-icon>favorite</md-icon> 
        </md-icon-button>

        <md-icon-button  aria-label="Search for Contact">
        <md-icon>search</md-icon>
        </md-icon-button>

        <md-fab label="回到首行" aria-label="upward">
            <md-icon slot="icon"> arrow_upward</md-icon>
        </md-fab>

        <divider/>
        <md-list-item>
            <div slot="headline">个人简介👋</div>
        </md-list-item>
        <divider/>
        <md-list-item>
            <div slot="supporting-text"> 🎓 济南大学——Major in Computer & Science</div>
        </md-list-item>
        <md-list-item>
           <div slot="supporting-text"> 💻 学习路线：C → C++ → Python (ing) → 深度学习(ing) → 计算机视觉 (ing) → JavaScript → Kotlin </div>
        </md-list-item>
        <md-list-item>
            <div slot="supporting-text"> 📱 玩机设备：Pixel 3/6Pro/9Pro XL、Surface Pro 4/5/7/8、OnePlus 13T</div>
        </md-list-item>
        <md-list-item>
             <div slot="supporting-text"> 🛠️ 开发环境：Ubuntu + Android 17</div>
        </md-list-item>
        <md-list-item>
             <div slot="supporting-text"> ✨ 目标方向：全栈开发、开源贡献、算法竞赛</div>
        </md-list-item>

        <divider/>
        <md-list-item>
            <div slot="headline">🚀 项目经历</div>
        </md-list-item>
        <divider/>
        <md-list-item>
                <div slot="supporting-text">济大繁星评分打分系统🌟</div>
        </md-list-item>
        <md-list-item>
                <div slot="supporting-text">🖥️ 参与打分系统前端开发（Vue3 技术栈）</div>
        </md-list-item>
        <md-list-item>
                <div slot="supporting-text">🚀 独立完成测试系统前端 + 仓库全栈开发</div>
        </md-list-item>
        <md-list-item>
                <div slot="supporting-text">🎯核心价值：解决校内评分打分的实际业务需求</div>
        </md-list-item>
        <divider/>
        <md-list-item>
                <div slot="supporting-text">停车场管理系统🅿️</div>
        </md-list-item>
        <divider/>
        <md-list-item>
                <div slot="supporting-text">📖 大一上学期C语言课程设计项目</div>
        </md-list-item>
        <md-list-item>
                <div slot="supporting-text">💡技术亮点：基于C语言实现停车场的车位管理、计费、查询等核心功能</div>
        </md-list-item>
        <md-list-item>
                <div slot="supporting-text">📝 收获：夯实C语言基础，理解重构程序设计思想</div>
        </md-list-item>

        <divider/>
        <md-list-item>
                <div slot="supporting-text">开源贡献🌍</div>
        </md-list-item>
        <divider/>
        <md-list-item>
                <div slot="supporting-text">🐞 帮助阅读项目问题反馈/功能/代码审阅</div>
        </md-list-item>
        <md-list-item>
                <div slot="supporting-text">📖 帮助calibre-web-automated项目完善中文翻译，提升中文用户体验，功能反馈</div>
        </md-list-item>
        <divider/>
    </md-list>
</template>


<script setup>
    import Divider from './Divider.vue';
</script>

<style></style>

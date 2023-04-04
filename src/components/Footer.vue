<script setup lang="ts">
import { Links } from "../router/type";

</script>

<template>
    <div class="footer-container">
        <div class="footer-main-view">
            <img class="footer-logo-view" src="../assets/logo_footer@2x.png" style="height: 30px;" alt="">

            <div class="footer-email-view ele-show-mobile ">
                <img src="../assets/邮箱@2x.png" style="width: 40px;height: 40px;vertical-align: middle;" alt="">
                contact@btcdomains.io
            </div>

            <div class="footer-links-view">
                <a :href="Links.doc" target="_blank">
                    <img class="link-icon" src="../assets/gitbook@2x.png" alt="">
                </a>

                <a :href="Links.twitter" target="_blank">
                    <img class="link-icon" src="../assets/linktree@2x.png" alt="">
                </a>

                <a :href="Links.twitter" target="_blank">
                    <img class="link-icon" src="../assets/twitter@2x.png" alt="">
                </a>

                <a :href="Links.medium" target="_blank">
                    <img class="link-icon" src="../assets/medium@2x.png" alt="">
                </a>

                <a :href="Links.github" target="_blank">
                    <img class="link-icon" src="../assets/github@2x.png" alt="">
                </a>
            </div>

            <div class="footer-email-view ele-show">
                <img src="../assets/邮箱@2x.png" style="width: 40px;height: 40px;vertical-align: middle;" alt="">
                contact@btcdomains.io
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer-container {
    border-top: 1px solid lightgray;
}

.footer-main-view {
    max-width: 1200px;
    margin: 0 auto;
    background: #FFFFFF;
}

@media screen and (max-width: 599px) {
    .footer-logo-view {
        margin-top: 30px;
        max-width: 40%;
    }

    .footer-links-view {
        /* width: 100%; */
        min-width: 40%;
        margin-left: 10px;
    }

    .footer-email-view {
        margin-left: 10px;
        min-width: 25%;
        font-size: 14px;
        font-weight: 400;
        color: #222840;
        line-height: 100px;
    }

    .link-icon {
        width: 32px;
        height: 32px;
        margin-top: 30px;
    }

    .ele-show-mobile {
        display: none;
    }
}

@media screen and (min-width: 600px){
    .footer-logo-view {
        margin-top: 30px;
        max-width: 15%;
    }

    .footer-links-view {
        float: right;
        width: 50%;
        min-width: 30%;
        text-align: center;
    }

    .footer-email-view {
        float: right;
        min-width: 25%;
        float: right;
        font-size: 14px;
        font-weight: 400;
        color: #222840;
        line-height: 100px;
    }

    .link-icon {
        width: 32px;
        height: 32px;
        margin-top: 30px;
        margin-left: 5px;
    }

    .ele-show {
        display: none;
    }
}
</style>

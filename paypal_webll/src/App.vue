<template>
    <div id="app" :style="{paddingTop:shipeiTop,paddingBottom:shipeiBottom}">
        <!--<transition :name="$store.state.routerTransition">-->
            <!--<keep-alive>-->
                <router-view class="child-view"/>
            <!--</keep-alive>-->
        <!--</transition>-->
    </div>
</template>

<script>
    import userhelper from './helper/userhelper';
    export default {
        name: 'App',
        data() {
            return {
                shipeiBottom: '',
                shipeiTop: '',
            }
        },
        created() {
            let phoneModel = userhelper.choosePhoneModel();
            if (phoneModel.quanping) {
                if (phoneModel.phoneX) {
                    this.shipeiTop = "44px";
                    this.shipeiBottom = '34px'
                } else {
                    this.shipeiTop = "20px";
                    this.shipeiBottom = '0'
                }
            } else {
                this.shipeiBottom = 0;
                this.shipeiTop = 0;
            }
        }
    }
</script>

<style>
    #app {
        width: 100%;
        height: 100%;
        background: #F4F4F4;
        font-family: 'Avenir-Medium';
    }

    /*样式重置*/
    html {
        font-family: sans-serif;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        padding: 0;
    }

    body {
        overflow: hidden;
    }

    html {
        /*position: relative;*/
        /*top: 100px;*/
    }

    html,
    body,
    div,
    span,
    object,
    iframe,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    blockquote,
    pre,
    abbr,
    address,
    cite,
    code,
    del,
    dfn,
    em,
    img,
    ins,
    kbd,
    q,
    samp,
    small,
    strong,
    sub,
    sup,
    var,
    b,
    i,
    dl,
    dt,
    dd,
    ol,
    ul,
    li,
    fieldset,
    form,
    label,
    legend,
    article,
    aside,
    canvas,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section,
    summary,
    time,
    mark,
    audio,
    video {
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        font-size: 100%;
        vertical-align: baseline;
        background: transparent;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
    }

    body {
        padding-top: 0;
        /*padding-bottom: 44px;*/
        box-sizing: border-box;
    }

    article,
    aside,
    details,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    main,
    nav,
    section,
    summary {
        display: block
    }

    audio,
    canvas,
    progress,
    video {
        display: inline-block;
        vertical-align: baseline
    }

    audio:not([controls]) {
        display: none;
        height: 0
    }

    [hidden],
    template {
        display: none
    }

    a {
        background: transparent;
        text-decoration: none;
    }

    a:active,
    a:hover {
        outline: 0
    }

    abbr[title] {
        border-bottom: 1px dotted
    }

    b,
    strong {
        font-weight: bold
    }

    dfn {
        font-style: italic
    }

    mark {
        background: #ff0;
        color: #000
    }

    sub,
    sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline
    }

    sup {
        top: -0.5em
    }

    sub {
        bottom: -0.25em
    }

    img {
        border: 0
    }

    svg:not(:root) {
        overflow: hidden
    }

    figure {
        margin: 1em 40px
    }

    hr {
        box-sizing: content-box;
        height: 0
    }

    pre {
        overflow: auto
    }

    code,
    kbd,
    pre,
    samp {
        font-family: monospace, monospace;
        font-size: 1em
    }

    button,
    input,
    optgroup,
    select,
    textarea {
        margin: 0
    }

    button {
        overflow: visible;
        outline: none;
        border: none;
        background: none;
        list-style-type: none;
    }

    input:focus,
    button:focus {
        outline: 0;
    }

    input:active,
    button:active {
        outline: 0;
    }

    input:visited,
    button:visited {
        outline: 0
    }

    textarea {
        overflow: auto
    }

    ul,
    li,
    dl,
    dt,
    dd {
        list-style: none;
    }

    .float-left {
        float: left
    }

    .float-right {
        float: right
    }

    .float-clear:after {
        content: "";
        display: block;
        clear: both
    }

    html {
        height: 100%;
    }

    body {
        min-width: 320px;
        font-family: 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', arial, sans-serif, 'Droid Sans Fallback';
        font-size: 16px;
        height: 100%;
    }

    div {
        box-sizing: border-box
    }

    html {
        font-size: 14px
    }

    @media screen and (min-width: 321px) and (max-width: 375px) {
        html {
            font-size: 16px
        }
    }

    @media screen and (min-width: 376px) and (max-width: 414px) {
        html {
            font-size: 18px
        }
    }

    @media screen and (min-width: 415px) and (max-width: 639px) {
        html {
            font-size: 20px
        }
    }

    @media screen and (min-width: 640px) and (max-width: 719px) {
        html {
            font-size: 24px
        }
    }

    @media screen and (min-width: 720px) and (max-width: 749px) {
        html {
            font-size: 28px
        }
    }

    @media screen and (min-width: 750px) and (max-width: 799px) {
        html {
            font-size: 30px
        }
    }

    @media screen and (min-width: 800px) {
        html {
            font-size: 48px
        }
    }
</style>

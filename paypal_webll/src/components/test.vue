
<style scoped>
  :root{
    --color: #95e9ef;
    --background: #1f1f1f;
    --spacing: 1rem;
    --speed: 1700ms;
    --fontsize: 2rem;
    }
  body{
    margin: 0;
    padding: var(--spacing);
    font-family: Karbon, Helvetica, sans-serif;
    color: var(--color);
    background: var(--background);
  }
  #app{
    display: grid;
    grid-gap: var(--spacing);
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    min-height: calc(100vh - var(--spacing)*2);
  }
  h1{
    align-self: start;
  }
  h1, button{
    margin: 0;
    padding: 0;
    grid-column: 1 / -1;
    font-size: var(--fontsize);
    line-height: 1.2;
    font-weight: 300;
    border: 4px solid var(--color);
    border-width: 4px 0;
  }
  img{
    max-width: 100%;
    display: block;
  }
  button{
    border-radius: 0;
    color: var(--color);
    background: transparent;
    grid-column: 1 / -1;
    outline: none;
    cursor: pointer;
    align-self: end;
  }
  a{
    color: inherit;
    text-decoration: none;
  }
  .error{
    grid-column: 1 / -1;
    justify-self: center;
  }
  .loading{
    width: calc(var(--spacing)*3);
    height: calc(var(--spacing)*3);
    grid-column: 1 / -1;
    justify-self: center;
    align-self: center;
    background: var(--color);
    animation: load var(--speed) infinite ease-in-out;
    transform: rotate(0);
  }
  @keyframes load{
    100%{
      transform: rotate(360deg);
    }
  }
</style>

<template>
<body>
  <div class="test2asd">
    <h1><a :href="instapage">@{{ username }} on instagram</a></h1>
    <div v-if="grams.length > 0">
        <div v-for="(gram, index) in grams">
            <a href="https://www.instagram.com/p/BjXplo-ASdr/">
              <img :src="gram.images.standard_resolution.url" :alt="gram.text" />
            </a>
        </div>
    </div>
    <div v-else class="loading"></div>
    <div v-if="error" class="error">Sorry, the Instagrams couldn't be fetched.</div>
    <button @click="getMoreGrams">Load More</button>
  </div>
</body>

</template>



<script>
let axios = require('axios');

export default {
    // el: '#app',
    data() {
        return {
              access_token: "1362124742.3ad74ca.6df307b8ac184c2d830f6bd7c2ac5644",
              url: "https://api.instagram.com/v1/users/self/media/recent/",
              username: "",
              grams: [],
              next_url: "",
              error: false
          }
    },
    computed: {
      instapage() {
        return 'https://www.instagram.com/' + this.username
      }
    },
    methods: {
      getGrams() {
        axios.get(this.url + "?access_token=" + this.access_token)
          .then(({data}) => {
            this.grams = data.data
            this.username = data.data[0].user.username
            this.next_url = data.pagination.next_url
          })
          .catch(function (error) {
            console.log(error)
            this.error = true
          });
      },
      getMoreGrams(){
        axios.get(this.next_url)
          .then(({data}) => {
            this.grams = this.grams.concat(data.data)
            this.next_url = data.pagination.next_url
          })
          .catch(function (error) {
            console.log(error)
            this.error = true
          });
      }
    },
    created() {
      this.getGrams();
    }
  }

</script>

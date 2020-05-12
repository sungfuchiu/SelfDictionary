<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-text-field v-model="searchText" v-on:keyup.enter="search" label="Search">
        </v-text-field>
      </v-col>
      <v-col cols="12">
          <v-text-field
            v-model="newExplanation"
            outlined
            clearable
            label="Explanation"
            type="text"
          >
            <template v-slot:append-outer>
              <v-btn text @click="addExplanation" color="primary">Add</v-btn>
            </template>
          </v-text-field>
      </v-col>

      <v-col cols="12">
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(item,i) in searchResult"
            :key="i"
          >
            <ExplainPad v-bind:word="searchText" v-bind:explain="item.val().explanation" v-bind:explainKey="item.key" v-bind:sentences="item"></ExplainPad>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>

        <p class="subheading font-weight-regular">
          For help and collaboration with other Vuetify developers,
          <br>please join our online
          <a
            href="https://community.vuetifyjs.com"
            target="_blank"
          >Discord Community</a>
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          What's next?
        </h2>

        <v-row justify="center">
          <a
            v-for="(next, i) in whatsNext"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ next.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Important Links
        </h2>

        <v-row justify="center">
          <a
            v-for="(link, i) in importantLinks"
            :key="i"
            :href="link.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ link.text }}
          </a>
        </v-row>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Ecosystem
        </h2>

        <v-row justify="center">
          <a
            v-for="(eco, i) in ecosystem"
            :key="i"
            :href="eco.href"
            class="subheading mx-3"
            target="_blank"
          >
            {{ eco.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  const firebase = require('../firebaseConfig.js')
  import ExplainPad from './ExplainPad'; 

  // function getData(data){
  //   console.log(data);
  //   this.searchText = data.key;
  // }
  export default {
    name: 'HelloWorld',
    components: {
      'ExplainPad' : ExplainPad
    },
    methods: {
      search(){
        var ref = firebase.db.ref('vocabulary/' + this.searchText);
        console.log(this.searchText);
        ref.on('value', 
        (data) => {
          this.searchResult = [];
          data.forEach( (item)=>{this.searchResult.push(item)});
          // this.searchResult = data.key;
          let test = []//Object.entries(this.searchResult[0]);
          this.searchResult[0].forEach( (item) => {test.push(item)});
          console.log(test);
          console.log(this.searchResult[0]);
        }, 
        (data) => {console.log(data)})
      },
      addExplanation() {
        var ref = firebase.db.ref(`vocabulary/${this.searchText}`);
        ref.push({ explanation : this.newExplanation });
        console.log(this.newExplanation);
        console.log(this.searchText);
      }
    },
    data: () => ({
      searchText: '',
      searchResult: [

      ],
      newExplanation: '',
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/layout/pre-defined',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),
  }
</script>

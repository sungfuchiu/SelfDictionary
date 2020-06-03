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
            v-on:keyup.enter="addExplanation"
          >
            <template v-slot:append-outer>
              <v-btn text @click="addExplanation" color="primary">Add</v-btn>
            </template>
          </v-text-field>
      </v-col>

      <v-col cols="12">
        <v-alert type="info" v-if="isSearchFail">
          Word not found.
        </v-alert>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(item,i) in searchResult"
            :key="i"
          >
            <ExplainPad 
              v-bind:word="searchText" 
              @searchWord="searchWord"
              v-bind:explain="item.val().explanation" 
              v-bind:synonyms="item.val().synonym" 
              v-bind:antonyms="item.val().antonym" 
              v-bind:explainDate="item.val().date" 
              v-bind:explainKey="item.key" 
              v-bind:sentences="getGenerator(item)">
            </ExplainPad>
          </v-expansion-panel>
        </v-expansion-panels>
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
        this.isSearchFail = false;
        this.searchText = this.searchText.trim();
        if(!this.searchText)
          return;
        let vocabRef = firebase.db.ref('vocabulary/' + this.searchText);
        let vocabCountRef = firebase.db.ref(`vocabulary/${this.searchText}/count`);
        let deleteSpill = firebase.db.ref('vocabulary/spill');
        deleteSpill.on('value',
        (data) => {
          if(data){
            let temp = [];
            data.forEach( (item)=>{temp.push(item)});
            console.log("for temp");
              console.log(temp);
            for(let item in temp){
            console.log("for key");
              console.log(item.key);
              if(item.val() !== '-M86AuN9SZ-Th3BEwH5N'){
                item = null;
              }
            }
          }
        }, 
        (data) => {console.log(data)});
        vocabRef.on('value', 
        (data) => {
          if(data){
            this.searchResult = [];
            console.log("for another data");
              console.log(data);
            data.forEach( (item)=>{this.searchResult.push(item)});
            console.log(vocabCountRef);
            vocabCountRef.on('value', (count) => {
              console.log(count.value);
              if(count.value){                
                count.value = count.value + 1;
              }else{
                count.value = 0;
              }
            })
            if(this.searchResult.length === 0){
              this.isSearchFail = true;
            }
          }
        }, 
        (data) => {console.log(data)})
      },
      addExplanation() {
        this.newExplanation = this.newExplanation.trim();
        let explainRef = firebase.db.ref(`vocabulary/${this.searchText}`);
        let searchExplainRef = firebase.db.ref(`vocabulary/${this.searchText}`).orderByChild('explanation').equalTo(this.newExplanation);
        let today = new Date();
        let time = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let addItem = {explanation : this.newExplanation, date : time};
        this.isSearchFail = false;  
        searchExplainRef.once('value', function(snapshot){
          if(!snapshot.exists()){
            explainRef.push(addItem);
          }
        });
      },
      getGenerator(items) {
        if(items){
          let array = [];
          items.forEach((item) => {array.push(item)});
          return array;
        }
      },
      searchWord(value){
        this.searchText = value;
        this.search();
      }
    },
    data: () => ({
      searchText: '',
      searchResult: [],
      isSearchFail:false,
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

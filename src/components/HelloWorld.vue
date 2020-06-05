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
      ],
    }),
  }
</script>

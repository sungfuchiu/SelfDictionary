<template>
  <v-container>
    <v-row>
      <v-menu
        ref="startMenu"
        v-model="startMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="start"
        transition="scale-transition"
        min-width="290px"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="start"
            label="Start Date"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="start"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="startMenu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.startMenu.save(start);"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
      <v-menu
        ref="endMenu"
        v-model="endMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="end"
        transition="scale-transition"
        min-width="290px"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="end"
            label="End Date"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="end"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="endMenu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.endMenu.save(end)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
      <v-menu
        ref="nowMenu"
        v-model="nowMenu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="now"
        transition="scale-transition"
        min-width="290px"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="now"
            label="Today"
            prepend-icon="mdi-calendar"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="now"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="nowMenu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.nowMenu.save(now)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
      <v-btn outlined fab dark color="teal" @click="searchByDate">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-text-field 
          label="Search"
          v-model="searchText" 
          v-on:keyup.enter="search" 
          :rules="[value => /^[a-zA-Z\s]*$/.test(value) || 'This field must be texts',]">
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
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
              v-bind:explainDate="new Date(item.val().date).toLocaleDateString('en-US')" 
              v-bind:explainKey="item.key" 
              v-bind:sentences="getGenerator(item)">
            </ExplainPad>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-list two-line>
          <template v-for="(item, index) in searchResultByDate">
            <v-subheader
              :key="item.key"
            >
              {{ item.key }}
            </v-subheader>

            <v-divider
              :key="index"
            ></v-divider>

            <!-- <v-list-tile
              :key="item.key"
            >
              <v-list-tile-content>
                <v-list-tile-title v-html="item.key"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.key"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile> -->
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  const firebase = require('../firebaseConfig.js')
  import ExplainPad from './ExplainPad'; 

  export default {
    name: 'SearchPage',
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
        let addItem = {explanation : this.newExplanation, date : new Date()};
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
      },
      searchByDate(){
        console.log(this.start);
        console.log(this.end);
        //if stoed type is time stamp, it should be able to search with those methods
        // 2020/7/5 but it failed. I probably need to use firestore
        let searchByDateRef = firebase.db.ref()
                              .child('brawl')
                              .orderByChild('date')
                              .startAt(this.star)
                              .endAt(this.end);
        // let searchByDateRef = firebase.db.ref('vocabulary')
        //                       .where("timestamp", ">=", "2017-11")
        //                       .where("timestamp", "<", "2017-12");
            let tempArray = [];
        searchByDateRef.once('value', function(snapshot){
          // console.log(snapshot);
            snapshot.forEach((item) => {tempArray.push(item)});
        });
            this.searchResultByDate = tempArray;
      }
    },
    data: () => ({
      searchText: '',
      searchResult: [],
      isSearchFail:false,
      newExplanation: '',
      startMenu:false,
      start: '',
      endMenu:false,
      end:'',
      nowMenu:false,
      now:null,
      searchResultByDate:[],
    }),
  }
</script>

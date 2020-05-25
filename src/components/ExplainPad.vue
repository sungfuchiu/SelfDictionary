<template>
    <v-expansion-panels>
        <v-expansion-panel>
        <v-expansion-panel-header>
            <v-row>
                <v-col cols="10">
                    <v-col cols="12">{{ `${explain} ${explainDate}` }}</v-col>
                </v-col>
                <v-col cols="2" offset>
                    <!-- @click.native.stop="show" -->
                    <v-btn icon color="red" @click.stop="cancelDialog = true">
                        <v-icon>mdi-close-circle-outline</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-row>
                <v-col cols="12">
                    <v-text-field
                        clearable
                        v-model="newSentence"
                        v-on:keyup.enter="addSentence">
                        <template v-slot:append-outer>
                            <v-btn text @click="addSentence" color="primary">Add</v-btn>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row v-for="(item, i) in sentences" :key="i">
                <v-col cols="11">
                    <p>{{ item.val().sentence }} {{item.key}}</p>
                </v-col>
                <v-col cols="1">
                    <v-btn icon color="red" :id="item.key" @click="removeSentence($event)">
                        <v-icon>mdi-close-circle-outline</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-expansion-panel-content>
        </v-expansion-panel>
        <v-dialog v-model="cancelDialog" max-width="300px">
        <v-card>
          <v-card-title>
            Confirm
          </v-card-title>
          <!-- <v-card-text>
            <v-btn color="primary" dark>Open Dialog 3</v-btn>
          </v-card-text> -->
          <v-card-actions>
            <v-btn color="primary" text @click="cancelDialog=false">Cancel</v-btn>
            <v-btn color="red" text @click="removeExplain">Remove</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-expansion-panels>
</template>

<script>

  const firebase = require('../firebaseConfig.js')

export default {
    props: {
        explain: String,
        sentences: Array,
        word: String,
        explainKey: String,
        explainDate: String,
    },
    methods:{
        addSentence(){
            if(this.newSentence){
                var ref = firebase.db.ref(`vocabulary/${this.word}/${this.explainKey}`);
                let searchSentenceRef = firebase.db.ref(`vocabulary/${this.word}/${this.explainKey}`).orderByChild('sentence').equalTo(this.newSentence);
                let newSentence = this.newSentence;
                searchSentenceRef.once('value', function(snapshot){
                if(!snapshot.exists()){
                    ref.push({ sentence : newSentence });
                }
                });
            }
        },
        removeExplain(){
            var ref = firebase.db.ref(`vocabulary/${this.word}/${this.explainKey}`);
            ref.remove();
            this.cancelDialog = false;
        },
        removeSentence(event){
            let targetId = event.currentTarget.id;
            console.log(targetId);
            // var ref = firebase.db.ref(`vocabulary/${this.word}/${this.explainKey}`);
            // ref.remove();
        }
    },
    data: () => ({
        newSentence: '',
            cancelDialog: false,
    })
}
</script>
<template>
    <v-expansion-panels>
        <v-expansion-panel>
        <v-expansion-panel-header>
            <v-row>
                <v-col cols="9">
                    <v-col cols="12">{{ `${explain} ${explainDate}` }}</v-col>
                </v-col>
                <v-col cols="3" offset>
                    <!-- @click.native.stop="show" -->
                    <v-btn icon color="red" @click.stop="cancelDialog = true">
                        <v-icon>mdi-close-circle-outline</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            </v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-text-field
                clearable
                v-model="newSentence"
                @click:prepend="addSentence">
                <template v-slot:prepend>
                    <v-btn icon class="mx-2" @click="addSentence" dark color="indigo">
                        <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
            <p v-for="(item, i) in sentences" :key="i">{{ item.val().sentence }}</p>
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
        }
    },
    data: () => ({
        newSentence: '',
            cancelDialog: false,
    })
}
</script>
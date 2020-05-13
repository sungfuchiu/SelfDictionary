<template>
    <v-expansion-panels>
        <v-expansion-panel>
        <v-expansion-panel-header>{{ explain }}</v-expansion-panel-header>
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
    },
    methods:{
        addSentence(){
            var ref = firebase.db.ref(`vocabulary/${this.word}/${this.explainKey}`);
            ref.push({ sentence : this.newSentence });
            console.log(this.newSentence);
        },
    },
    data: () => ({
        newSentence: '',
    })
}
</script>
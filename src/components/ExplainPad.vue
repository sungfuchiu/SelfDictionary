<template>
    <v-expansion-panels>
        <v-expansion-panel>
        <v-expansion-panel-header>{{ explain }}</v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-text-field
                clearable
                v-model="newExplanation"
                @click:append="addSentence">
                <template v-slot:prepend>
                    <v-btn icon class="mx-2" dark color="indigo">
                        <v-icon dark>mdi-plus</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
            <p v-for="(sentence, i) in sentences" :key="i">{{ sentence }}</p>
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
    },
    methods:{
        addSentence(){
            var ref = firebase.db.ref(`vocabulary/${this.word}/${this.explain}`);
            ref.push({ explanation : this.newExplanation });
            console.log();
        },
    },
    data: () => ({
        newExplanation: '',
    })
}
</script>
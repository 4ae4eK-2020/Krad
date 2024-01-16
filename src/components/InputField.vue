<template>
    <q-input rounded outlined :value="value" @input="updateValue" :label="label" maxlength="50" fill-mask
        :rules="rules" :mask="mask" :type="type" :readonly="readonly" />
</template>

<script>
export default {
    data() {
        return {
            currentValue: "",
        }
    },
    props: {
        value: {
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        mask: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: ''
        },
        rules: {
            type: Array,
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        updateValue(val) {
            this.$emit("update", val)
        }
    },

}

//:rules="[val => val.length > 0 || 'Поле не может быть пустым']"

</script>

<style></style>
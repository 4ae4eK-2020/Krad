<template>
    <div>
        <q-toggle @input="update" v-model="toggle" checked-icon="check" color="green" unchecked-icon="clear"
            label="Активирован" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            toggle: true
        }
    },
    mounted(){
        this.toggle = this.value
    },
    methods:
    {
        update(val) {
            this.$emit("update", val)
        }
    },
    props: {
        value: {
            type: Boolean,
            default: true
        },
    }
}
</script>

<style></style>
<template>
    <q-form @submit="update" @reset="cancel" class="flex row q-gutter-lg shadow-2 q-px-lg rounded-borders"
        :class="{ 'bg-blue-1': isCreated }">
        <InputField readonly :value="userid" label="Id" v-if="userid != -1" />

        <InputField :value="currentName" label="ФИО" :rules="[val => val.length > 0 || 'Поле не может быть пустым']"
            @update="(val) => currentName = val" />

        <InputField :value="currentEmail" label="Email"
            :rules="[(val, rules) => rules.email(val) || 'Введите корректный Email']"
            @update="(val) => currentEmail = val" />

        <InputField :value="currentRegistration" label="Дата регистрации" type="date"
            :rules="[val => val != '' || 'Выберите дату']" @update="(val) => currentRegistration = val" />

        <q-input rounded outlined v-model="currentPhone" label="Номер телефона" mask="+7 (###) ### - ## - ##" fill-mask
            :rules="[val => val.length == 22 || 'Введите номер полностью']" />
        <!-- <InputField :value="currentPhone" label="Номер телефона" mask="+7 (###) ### - ## - ##"
            :rules="[val => val.length == 22 || 'Введите номер полностью']" @update="(val) => currentPhone = val" /> -->

        <!-- <ActivateToggle :value="currentIsActive" @update="(val) => currentIsActive = val" /> -->
        <div>
            <q-toggle v-model="currentIsActive" checked-icon="check" color="green" unchecked-icon="clear"
                label="Активирован" />
        </div>
        <EditConfirm v-if="isUpdate" />

        <div>
            <q-btn round color="red" icon="delete" @click="deleteUser" />
        </div>

    </q-form>
</template>

<script>
import InputField from 'components/InputField.vue'
import EditConfirm from 'components/EditConfirm.vue'
// import ActivateToggle from 'components/ActivateToggle.vue'

export default {
    name: 'UserPannel',
    components: {
        InputField,
        EditConfirm,
        // ActivateToggle
    },
    data() {
        return {
            currentName: '',
            currentEmail: '',
            currentPhone: '',
            currentRegistration: '',
            currentIsActive: true

        }
    },
    computed: {
        isUpdate() {
            if (this.currentName != this.username ||
                this.currentEmail != this.email ||
                this.currentId != this.userid ||
                this.currentPhone != this.phone ||
                this.currentIsActive !== this.isActive ||
                this.currentRegistration != this.registration) {
                return true;
            }
            return false;
        },
    },
    props: {
        username: {
            type: String,
            default: ''
        },
        email: {
            type: String,
            default: ''
        },
        registration: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        userid: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isCreated: {
            type: Boolean,
            default: false
        },
    },
    mounted() {
        this.reset();
    },
    methods: {
        updateName(val) {
            this.currentName = val
        },
        cancel() {
            this.$emit("cancelUpdateUser")
            this.reset();
        },
        reset() {
            this.currentName = this.username;
            this.currentEmail = this.email;
            this.currentId = this.userid;
            this.currentPhone = this.phone;
            this.currentIsActive = this.isActive;
            this.currentRegistration = this.registration;
        },
        update() {
            this.confirm("Вы уверены?", () => {
                let newUser = {
                    id: this.userid,
                    name: this.currentName,
                    email: this.currentEmail,
                    registration: this.currentRegistration,
                    phone: this.currentPhone,
                    isActive: this.currentIsActive,
                };
                this.$emit("updateUser", newUser)
            });


        },
        deleteUser() {
            if (this.currentName == "" && this.currentEmail == "" && this.currentPhone == "" && this.currentRegistration == "") {
                this.$emit("deleteUser", this.userid);
                return;
            }

            this.confirm("Вы уверены, что хотите удалить пользователя?",
                () => this.$emit("deleteUser", this.userid));

        },
        confirm(dialogText, okFunc) {
            return this.$q.dialog({
                title: 'Подтверждение',
                message: dialogText,
                cancel: true,
                persistent: true,
                ok: {
                    label: "Да"
                },
                cancel: {
                    label: "Нет"
                }
            }).onOk(() => {
                okFunc();
            })
        }
    }
}
</script>

<style></style>

        <!-- фио
почта
дата регитрции
телефон
активирован или нет -->
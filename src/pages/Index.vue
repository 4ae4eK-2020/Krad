<template>
  <q-page class="flex column items-start items-center q-gutter-lg">
    <UserPannel v-for="(u, index) in users" :key="index" :userid="u.id" :username="u.name" :email="u.email"
      :phone="u.phone" :registration="u.registration.split('T')[0]" :isActive="u.isactive" @updateUser="updateUser"
      @deleteUser="deleteUser" />

    <UserPannel v-if="isUserCreate" :userid="users.length" @updateUser="createUser" @deleteUser="deleteUser"
      @cancelUpdateUser="deleteUser" isCreated />
    <q-btn unelevated rounded color="primary" label="Создать пользователя" v-else @click="isUserCreate = true"
      icon="person_add" />
  </q-page>
</template>

<script>
import UserPannel from 'components/UserPannel.vue'

export default {
  name: 'PageIndex',
  components: {
    UserPannel
  },
  data() {
    return {
      isUserCreate: false,
      users: [
        /*{
          id: 0,
          name: "asd asdf fddd",
          email: "ASdWww@asd.ras",
          registration: "2024-01-03",
          phone: "+7 (123) 455 - 65 - 55",
          isActive: false,
        },
        {
          id: 1,
          name: "iys kayo fade",
          email: "userdf2ww@gg.hu",
          registration: "2024-01-03",
          phone: "+7 (678) 987 - 45 - 21",
          isActive: true,
        }*/
      ]
    }
  },
  mounted() {
    //Полуения списка пользователей
this.updateTable();
  },
  methods: {
    updateTable() {
      fetch("http://localhost:5501/user/").then((response) => response.json())
        .then((json) => {
          this.users = json;
        });
    },
    updateUser(newUser) {
      let index = this.users.findIndex(u => u.id == newUser.id);
      if (index != -1) {
        this.users.splice(index, 1, newUser);
      }
      console.log(newUser)
      //Обновление пользователя
      fetch("http://localhost:5501/user/update", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
    },
    createUser(newUser) {
      // this.users.push(newUser)
      this.isUserCreate = false;

      //Создание пользователя
      fetch("http://localhost:5501/user/new/", {
        method: "POST",
        body: JSON.stringify(newUser),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) =>this.updateTable())
        //.then((user) => this.users.push(user));
    },
    deleteUser(userId) {
      if (this.isUserCreate) {
        this.isUserCreate = false;
        return;
      }
      // let index = this.users.findIndex(u => u.id == userId);
      // this.users.splice(index, 1);

      // Удаление пользователя
      fetch("http://localhost:5501/user/delete", {
        method: "POST",
        body: JSON.stringify({ id: userId }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => response.json())
        .then((json) => {
          if (json.result = "Done") {
            let index = this.users.findIndex(u => u.id == userId);
            this.users.splice(index, 1);
          }
        });
    },
  }
}
</script>

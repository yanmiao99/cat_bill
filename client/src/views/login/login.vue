<template>
  <div class="login">
    <div class="container">
      <div class="header">
        <img src="@/assets/images/logo.png" alt="logo">
        <h1>{{ config.globalName }}</h1>
      </div>
      <div class="content">
        <el-form
            ref="userFormRef"
            :model="userForm"
            :rules="rules"
            class="userForm"
        >
          <el-form-item prop="username">
            <el-input
                v-model="userForm.username"
                type="text"
                clearable
                placeholder="账号 : "
                autocomplete="off">
              <template #prefix>
                <el-icon>
                  <User/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
                v-model="userForm.password"
                type="password"
                clearable
                show-password
                placeholder="密码 : "
                @keyup.enter="submitForm(userFormRef)"
                autocomplete="off">
              <template #prefix>
                <el-icon>
                  <Lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="storePassword" class="auxiliary-box">
            <el-checkbox v-model="userForm.storePassword" label="记住密码" size="large"/>
            <span @click="handleForgotPassword">忘记密码?</span>
          </el-form-item>

          <el-form-item>
            <el-button class="submit-btn" type="primary" @click="submitForm(userFormRef)">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, Ref} from 'vue'
import type {FormInstance} from 'element-plus'
import {useRouter} from "vue-router";
import {usersStore} from "../../store/user"
import config from "../../config/config"
import {ElMessage} from 'element-plus'
import {postLogin} from "../../api/user";
import storage from "../../utils/storage";

const userFormRef = ref<FormInstance>()
const router = useRouter()
const store = usersStore()

interface IUserForm {
  username: string,
  password: string,
  storePassword: boolean
}

onMounted(() => {
  // userForm.value.storePassword = storage.getItem('storePassword') || false

  let storage_userForm = storage.getItem('userForm') || {}
  if (storage_userForm) {
    userForm.value = storage_userForm
  }
})

const userForm: Ref<IUserForm> = ref({
  username: '',
  password: '',
  storePassword: false,
})

const rules = ref({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 2, max: 16, message: '用户名长度为2-16个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 32, message: '密码长度应在6位数以上', trigger: 'blur'}
  ],
})


const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      if (userForm.value.storePassword) {
        storage.setItem('userForm', userForm.value)
      } else {
        storage.clearItem('userForm')
      }
      const res = await postLogin(userForm.value)
      store.storeUserInfo(res)

      // 完成提交, 清空表单
      formEl.resetFields()
      await router.push("/home")
    }
  })
}

const handleForgotPassword = () => {
  ElMessage({
    message: '请联系管理员',
    type: 'warning',
  })
}

</script>

<style scoped lang="scss">
.login {
  background: url("@/assets/images/login/bg.svg") center 110px / 100% no-repeat #f0f2f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: auto;

  .container {
    width: 400px;
    border-radius: 10px;
    padding: 40px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transform: scale(1.2);

    .header {
      display: flex;
      align-items: center;

      img {
        width: 60px;
        height: 60px;
      }

      h1 {
        margin-left: 10px;
        font-weight: bold;
        font-size: 30px;
        color: var(--el-color-primary);
      }
    }

    .content {
      width: 300px;
      margin-top: 40px;

      .auxiliary-box {
        :deep(.el-form-item__content) {
          display: flex;
          justify-content: space-between !important;
          align-items: center;

          & > span {
            color: var(--el-color-primary);
            cursor: pointer;
          }

          .el-checkbox.el-checkbox--large .el-checkbox__label {
            color: #333;
            font-weight: 400 !important;
          }
        }
      }

      .submit-btn {
        width: 100%;
      }
    }
  }
}

</style>

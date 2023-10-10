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
                v-auto-focus
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
          <el-form-item prop="captcha" v-if="loginOrRegister === 'login'">
            <div class="captcha_box">
              <el-input
                  v-model="userForm.captcha"
                  type="text"
                  clearable
                  @keyup.enter="submitForm(userFormRef)"
                  placeholder="验证码 : "
                  autocomplete="off">
                <template #prefix>
                  <el-icon>
                    <ScaleToOriginal/>
                  </el-icon>
                </template>
              </el-input>
              <div v-html="captcha_img" class="captcha_img" @click="getCaptchaImg"></div>
            </div>
          </el-form-item>

          <el-form-item prop="storePassword" class="auxiliary-box" v-if="loginOrRegister === 'login'">
            <el-checkbox v-model="userForm.storePassword" label="记住密码" size="large"/>
            <span @click="handleForgotPassword">忘记密码?</span>
          </el-form-item>

          <el-form-item>
            <div class="form-btn-group">
              <el-button class="submit-btn" type="primary" @click="submitForm(userFormRef)">
                {{ loginOrRegister === 'login' ? '登 录' : '注 册' }}
              </el-button>
              <el-button plain type="primary" @click="handleToggleLoginOrRegister">
                <el-icon>
                  <Refresh/>
                </el-icon>
              </el-button>
            </div>
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
import {postLogin, getCaptcha, postRegister} from "../../api/user";
import storage from "../../utils/storage";
import {useToggle} from "@vueuse/core";

const userFormRef = ref<FormInstance>()
const router = useRouter()
const store = usersStore()

interface IUserForm {
  username: string,
  password: string,
  storePassword: boolean,
  captcha: string,
}


onMounted(() => {
  let storage_userForm = storage.getItem('userForm') || {}
  if (storage_userForm) {
    userForm.value = storage_userForm
  }
  userForm.value.captcha = ''

  getCaptchaImg()
})

// 登录或注册
const loginOrRegister = ref('login')
const toggleLoginOrRegister = useToggle(loginOrRegister);

const handleToggleLoginOrRegister = () => {
  if (loginOrRegister.value === 'login') {
    toggleLoginOrRegister('register')
  } else {
    toggleLoginOrRegister('login')
  }
}


const captcha_img = ref('')
// 获取验证码
const getCaptchaImg = async () => {
  const res = await getCaptcha()
  captcha_img.value = res.captcha
}

const userForm: Ref<IUserForm> = ref({
  username: '',
  password: '',
  storePassword: false,
  captcha: ''
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
  captcha: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    {min: 4, max: 4, message: '验证码长度为4个字符', trigger: 'blur'},
  ],
})

// 表单提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (loginOrRegister.value === 'login') {
        // 登录逻辑
        loginFn(formEl)
      } else {
        // 注册逻辑
        registerFn(formEl)
      }
    }
  })
}

const loginFn = async (formEl: any) => {
  try {
    const res = await postLogin(userForm.value)
    store.storeUserInfo(res)
    if (userForm.value.storePassword) {
      storage.setItem('userForm', userForm.value)
    } else {
      storage.clearItem('userForm')
    }
    // 完成提交, 清空表单
    formEl.resetFields()
    await router.push("/home")
  } catch (e) {
    await getCaptchaImg()
    userForm.value.captcha = ''
  }
}

const registerFn = async (formEl: any) => {
  let res = await postRegister(userForm.value)
  if (res) {
    // 完成提交, 清空表单
    formEl.resetFields()
    ElMessage.success('注册成功, 请登录')
    toggleLoginOrRegister('login')
  }
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
  background: url("@/assets/images/login/bg.svg") center 110px / 100% no-repeat var(--el-border-color-extra-light);
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
            color: var(--el-text-color-primary);
            font-weight: 400 !important;
          }
        }
      }

      .captcha_box {
        display: flex;
        align-items: center;
        margin-top: -15px;
        width: 100%;

        .captcha_img {
          width: 100px;
          transform: scale(0.7);
          cursor: pointer;
        }
      }

      .form-btn-group {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .submit-btn {
          flex: 1;
        }
      }
    }
  }
}

</style>

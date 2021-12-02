import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = mongoose.Schema(
  {
    general: {
      email: {
        type: String,
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, '이메일 형식에 맞게 작성해주세요'],
      },
      password: {
        type: String,
        minlength: [8, '비밀번호를 8자 이상 입력해주세요'],
        match: [
          /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
          '비밀번호 형식에 맞지않습니다',
        ],
      },
    },
    google: {
      token: String,
      email: String,
    },
    naver: {
      token: String,
      email: String,
    },
    kakao: {
      token: String,
      email: String,
    },
    name: {
      type: String,
      required: true,
      minlength: [2, '성함을 2글자 이상 입력해주세요'],
      maxlength: [10, '성함을 10글자 이하로 입력해주세요'],
    },
    active: {
      lastAccessTime: {
        // 마지막 접속 시간 -> 로그아웃 시 수정해주기 patch
        type: Date,
      },
      isClosed: {
        // 탈퇴여부
        type: Boolean,
        required: true,
        default: false,
      },
    },
    isAdmin: {
      // 관리자 권한은 일반유저만
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// eslint-disable-next-line func-names
userSchema.methods.matchPassword = async function (enteredPassword) {
  const password = await bcrypt.compare(enteredPassword, this.general.password);
  return password;
};

userSchema.pre('save', async (next) => {
  if (!this.isModified('general')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.general.password = await bcrypt.hash(this.general.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
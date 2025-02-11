module.exports = {
    extends: [
        'next/core-web-vitals', // Next.jsのベース設定
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        // 'any'型に関する警告を無効化
        '@typescript-eslint/no-explicit-any': 'off',
    },
};

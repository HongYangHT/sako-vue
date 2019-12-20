/*
 * @Author: sam.hongyang
 * @LastEditors  : sam.hongyang
 * @Description:
 * @Date: 2019-12-18 11:51:33
 * @LastEditTime : 2019-12-19 16:20:54
 */
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-recommended-scss"],
  rules: {
    "block-no-empty": null,
    "color-no-invalid-hex": true,
    "comment-empty-line-before": [
      "always",
      {
        ignore: ["stylelint-commands", "after-comment"]
      }
    ],
    "declaration-colon-space-after": "always",
    indentation: [
      2,
      {
        except: ["value"]
      }
    ],
    "max-empty-lines": 2,
    "rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignore: ["after-comment"]
      }
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["extends", "ignores"]
      }
    ],
    "number-leading-zero": null,
    "unit-whitelist": ["em", "rem", "%", "s", "px", "vh", "vw", "deg"]
  },
  plugins: [ 'stylelint-scss' ]
};

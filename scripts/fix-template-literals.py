#!/usr/bin/env python3
"""把 chat-api.ts 中的 SYSTEM_PROMPT template literal 改成普通字串"""
import re

with open('src/lib/chat-api.ts', 'r') as f:
    content = f.read()

# 找到 SYSTEM_PROMPT 的 template literal
# 格式：const SYSTEM_PROMPT = `...`;
# 需要找到配對的結束 backtick

start_marker = 'const SYSTEM_PROMPT = `'
start_idx = content.find(start_marker)
if start_idx < 0:
    print("ERROR: SYSTEM_PROMPT not found")
    exit(1)

# 從 start 往後找結束的 backtick
# 要注意 template literal 中可能有 ${...} 和跳脫的 \`
i = start_idx + len(start_marker)
depth = 0
end_idx = -1
while i < len(content):
    ch = content[i]
    if ch == '\\' and i + 1 < len(content):
        i += 2  # 跳過跳脫字元
        continue
    elif ch == '`' and depth == 0:
        end_idx = i
        break
    i += 1

if end_idx < 0:
    print("ERROR: end of SYSTEM_PROMPT not found")
    exit(1)

# 提取 template literal 內容
inner = content[start_idx + len(start_marker):end_idx]

# 轉成普通字串：把 ` 換成 "，把內部 " 跳脫，把換行轉成 \n
# 先把內部未跳脫的 " 找出來
result = '"'
for i, ch in enumerate(inner):
    if ch == '\\' and i + 1 < len(inner):
        next_ch = inner[i + 1]
        if next_ch == '`':
            result += '`'
        elif next_ch == 'n':
            result += '\\n'
        elif next_ch == '\\':
            result += '\\\\'
        elif next_ch == '"':
            result += '\\"'
        else:
            result += '\\' + next_ch
        continue
    elif ch == '"':
        result += '\\"'
    elif ch == '\n':
        result += '\\n'
    elif ch == '\r':
        continue
    else:
        result += ch
result += '"'

new_line = 'const SYSTEM_PROMPT = ' + result + ';'
new_content = content[:start_idx] + new_line + content[end_idx + 1:]

with open('src/lib/chat-api.ts', 'w') as f:
    f.write(new_content)

print("Done! SYSTEM_PROMPT converted to regular string.")
print(f"Original length: {end_idx - start_idx}")
print(f"New length: {len(new_line)}")

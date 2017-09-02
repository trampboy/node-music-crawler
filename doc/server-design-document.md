# 服务端设计文档
## 域名
https://api.example.com/v1/*
## V1接口
### 获取全部的接口信息
```
GET /
```

### Request
```
{}
```

### Response
```
Status: 200 OK

{
    "comments_url":"https://api.example.com/v1/comments{?page=1&per_page=100}"        
}
```
### 获取评论
```
GET /comments{?page=1&per_page=100}
```

### 参数

| 名称       | 类型   | 描述   |
| -------- | ---- | ---- |
| page     | int  | 页数   |
| per_page | int  | 每页数量 |


### Request
```
{}
```

### Response
```
Status: 200 OK
Link: <https://api.example.com/v1/comments?page=1&per_page=100>; rel="next",
      <https://api.example.com/v1/comments?page=1&per_page=200>; rel="last"

[
    {
        "comment_id": 1, 
        "comment": "评论1", 
        "music_id": "1", 
        "music": "音乐1", 
        "author": "作者1"
    }, 
    {
        "comment_id": 2, 
        "comment": "评论2", 
        "music_id": "2", 
        "music": "音乐2", 
        "author": "作者2"
    }
]
```
## 控制台
让开发者可以立即体验一下API的功能




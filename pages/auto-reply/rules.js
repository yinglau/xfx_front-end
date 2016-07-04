module.exports = {
    rules: [
        {
            name: "rule1",
            keywords: ["aaa", "bbb", "ccc"],
            replys: [
                {
                    type: "text",
                    value: "text value"
                },
                {
                    type: "news",
                    value: "news value"
                },
                {
                    type: "img",
                    value: "img value"
                },
                {
                    type: "voice",
                    value: "voice value"
                },
                {
                    type: "video",
                    value: "video value"
                }
            ]
        },
        {
            name: "rule2",
            keywords: ["aaa", "bbb", "ccc"],
            replys: [
                {
                    type: "text",
                    value: "text value"
                },
                {
                    type: "news",
                    value: "news value"
                }
            ]
        }
    ]
}
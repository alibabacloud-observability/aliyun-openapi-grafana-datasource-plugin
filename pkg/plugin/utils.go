package plugin

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// 判断不区分大小写的键是否存在于 map[string] 中，并获取对应的值
func getValueIgnoreCase(data map[string]interface{}, keys []string) (interface{}, bool) {
	for _, key := range keys {
		for k, v := range data {
			if strings.EqualFold(k, key) {
				return v, true
			}
		}
	}
	return "", false
}

// 时间正则匹配
// formatDateTime 根据给定的格式字符串（如 "${__from:date:iso}"、"${__from:date:iso+n}"、"${__from:date:iso-n}" 或 "${__from:date}"）和时间戳，
// 解析时区信息（如果存在）并应用到日期时间的格式化输出。
func formatDateTime(formatStr string, timestamp time.Time) (string, error) {
	switch formatStr {
	case "${__from}":
		t := timestamp.String()
		return t, nil
	case "${__from:date:seconds}":
		t := timestamp.Unix()
		return strconv.FormatInt(t, 10), nil
	case "${__from:date:iso}":
		// 默认使用 UTC 时间
		t := timestamp.UTC()
		return t.Format(time.RFC3339), nil

	case "${__from:date}":
		// 使用本地时间
		t := timestamp.Local()
		return t.Format("2006-01-02 15:04:05"), nil

	default:
		// 检查是否存在时区偏移量
		re := regexp.MustCompile(`\$\{__from:date:iso([+-])(-?\d+)\}`)
		matches := re.FindStringSubmatch(formatStr)
		fmt.Println("matches:", matches)
		if len(matches) == 3 {
			sign := matches[1] // 符号 (+ 或 -)
			offsetStr := matches[2]
			fmt.Println("offsetStr:", offsetStr)
			offset, err := strconv.Atoi(offsetStr)
			if err != nil {
				return "", fmt.Errorf("failed to parse offset value: %v", err)
			}

			// 根据符号计算实际时区偏移量
			var offsetDuration time.Duration
			if sign == "+" {
				offsetDuration = time.Duration(offset) * time.Hour
			} else {
				offsetDuration = -time.Duration(offset) * time.Hour
			}

			// 创建对应时区
			loc := time.FixedZone("", int(offsetDuration.Seconds()))

			// 使用给定的时间戳和时区进行格式化
			t := timestamp.In(loc)
			return t.Format("2006-01-02 15:04:05"), nil
		}

		return "", fmt.Errorf("unsupported format string: %s", formatStr)
	}
}

// formatDateTimeForQuery 根据给定的格式字符串、查询时间范围对象（queryTimeRange）和时间类型（fromOrTo），
// 格式化相应的时间（起始时间或结束时间）。
func formatDateTimeForQuery(formatStr string, queryTimeRange QueryTimeRange, fromOrTo string) (string, error) {
	timestamp := queryTimeRange.From
	if fromOrTo == "to" {
		timestamp = queryTimeRange.To
	}

	// 替换格式字符串中的 "__from" 为 "__to"
	if fromOrTo == "to" {
		formatStr = strings.ReplaceAll(formatStr, "${__from}", "${__to}")
	}

	return formatDateTime(formatStr, timestamp)
}

type QueryTimeRange struct {
	From time.Time
	To   time.Time
}

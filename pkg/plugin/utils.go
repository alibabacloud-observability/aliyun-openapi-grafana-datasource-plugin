package plugin

import (
	"fmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// GetValueIgnoreCase 判断不区分大小写的键是否存在于 map[string] 中，并获取对应的值
func GetValueIgnoreCase(data map[string]interface{}, keys []string) (interface{}, bool) {
	for _, key := range keys {
		for k, v := range data {
			if strings.EqualFold(k, key) {
				return v, true
			}
		}
	}
	return "", false
}

var datePatternRegex = regexp.MustCompile("(LT|LL?L?L?|l{1,4}|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|Q)")

var datePatternReplacements = map[string]string{
	"M":    "1",                       // stdNumMonth 1 2 ... 11 12
	"MM":   "01",                      // stdZeroMonth 01 02 ... 11 12
	"MMM":  "Jan",                     // stdMonth Jan Feb ... Nov Dec
	"MMMM": "January",                 // stdLongMonth January February ... November December
	"D":    "2",                       // stdDay 1 2 ... 30 30
	"DD":   "02",                      // stdZeroDay 01 02 ... 30 31
	"DDD":  "<stdDayOfYear>",          // Day of the year 1 2 ... 364 365
	"DDDD": "<stdDayOfYearZero>",      // Day of the year 001 002 ... 364 365 @todo****
	"d":    "<stdDayOfWeek>",          // Numeric representation of day of the week 0 1 ... 5 6
	"dd":   "Mon",                     // ***Su Mo ... Fr Sa @todo
	"ddd":  "Mon",                     // Sun Mon ... Fri Sat
	"dddd": "Monday",                  // stdLongWeekDay Sunday Monday ... Friday Saturday
	"e":    "<stdDayOfWeek>",          // Numeric representation of day of the week 0 1 ... 5 6 @todo
	"E":    "<stdDayOfWeekISO>",       // ISO-8601 numeric representation of the day of the week (added in PHP 5.1.0) 1 2 ... 6 7 @todo
	"w":    "<stdWeekOfYear>",         // 1 2 ... 52 53
	"ww":   "<stdWeekOfYear>",         // ***01 02 ... 52 53 @todo
	"W":    "<stdWeekOfYear>",         // 1 2 ... 52 53
	"WW":   "<stdWeekOfYear>",         // ***01 02 ... 52 53 @todo
	"YY":   "06",                      // stdYear 70 71 ... 29 30
	"YYYY": "2006",                    // stdLongYear 1970 1971 ... 2029 2030
	"gg":   "<stdIsoYearShort>",       // ISO-8601 year number 70 71 ... 29 30
	"gggg": "<stdIsoYear>",            // ***1970 1971 ... 2029 2030
	"GG":   "<stdIsoYearShort>",       // 70 71 ... 29 30
	"GGGG": "<stdIsoYear>",            // ***1970 1971 ... 2029 2030
	"Q":    "<stdQuarter>",            // 1, 2, 3, 4
	"A":    "PM",                      // stdPM AM PM
	"a":    "pm",                      // stdpm am pm
	"H":    "<stdHourNoZero>",         // stdHour 0 1 ... 22 23
	"HH":   "15",                      // 00 01 ... 22 23
	"h":    "3",                       // stdHour12 1 2 ... 11 12
	"hh":   "03",                      // stdZeroHour12 01 02 ... 11 12
	"m":    "4",                       // stdZeroMinute 0 1 ... 58 59
	"mm":   "04",                      // stdZeroMinute 00 01 ... 58 59
	"s":    "5",                       // stdSecond 0 1 ... 58 59
	"ss":   "05",                      // stdZeroSecond ***00 01 ... 58 59
	"z":    "MST",                     // EST CST ... MST PST
	"zz":   "MST",                     // EST CST ... MST PST
	"Z":    "Z07:00",                  // stdNumColonTZ -07:00 -06:00 ... +06:00 +07:00
	"ZZ":   "-0700",                   // stdNumTZ -0700 -0600 ... +0600 +0700
	"X":    "<stdUnix>",               // Seconds since unix epoch 1360013296
	"LT":   "3:04 PM",                 // 8:30 PM
	"L":    "01/02/2006",              // 09/04/1986
	"l":    "1/2/2006",                // 9/4/1986
	"ll":   "Jan 2 2006",              // Sep 4 1986
	"lll":  "Jan 2 2006 3:04 PM",      // Sep 4 1986 8:30 PM
	"llll": "Mon, Jan 2 2006 3:04 PM", // Thu, Sep 4 1986 8:30 PM
}

func patternToLayout(pattern string) string {
	var match [][]string
	if match = datePatternRegex.FindAllStringSubmatch(pattern, -1); match == nil {
		return pattern
	}

	for i := range match {
		if replace, ok := datePatternReplacements[match[i][0]]; ok {
			pattern = strings.Replace(pattern, match[i][0], replace, 1)
		}
	}

	return pattern
}

// FormatDateTime 时间正则匹配: 根据给定的格式字符串和时间戳，
// 解析时区信息（如果存在）并应用到日期时间的格式化输出。
func FormatDateTime(formatStr string, timestamp time.Time) (string, error) {
	hasTimeOffset := strings.Contains(strings.ToLower(formatStr), "utc")
	loc := time.FixedZone("", 0)
	if hasTimeOffset {
		re := regexp.MustCompile(`.*?utc([+-])(\d+).*?`)
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
			loc = time.FixedZone("", int(offsetDuration.Seconds()))
		}
	}

	pattern := time.RFC3339
	re := regexp.MustCompile(`"(.+?)"`)
	matches := re.FindStringSubmatch(formatStr)
	if len(matches) > 1 {
		format := matches[1]
		pattern = patternToLayout(format)
	}

	return timestamp.In(loc).Format(pattern), nil
}

// FormatDateTimeForQuery 根据给定的格式字符串、查询时间范围对象（queryTimeRange）和时间类型（fromOrTo），
// 格式化相应的时间（起始时间或结束时间）。
func FormatDateTimeForQuery(formatStr string, queryTimeRange backend.TimeRange) (string, error) {
	timestamp := queryTimeRange.From
	// 如果formatStr包含"__to"，则使用结束时间，否则使用起始时间
	// 并全部替换为__from
	if strings.Contains(formatStr, "__time_to") {
		timestamp = queryTimeRange.To
	}
	return FormatDateTime(formatStr, timestamp)
}

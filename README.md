# 📖 Bible Tools

### 1. 🔦 Lookup by reference (e.g. John 3:16)

#### 1.1 Passage search
Default:
```bash
bible [options] [reference...]
```
Example:
```bash
bible Matthew 4:4
# =>
#   [4] But he answered, “It is written,
#
#   “‘Man shall not live by bread alone,
#        but by every word that comes from the mouth of God.’”
```
Or
```bash
bible mat 4:4
```

#### 1.1.1 Passage search to clipboard

```bash
bible -c [passage...]
```
```bash
bible --copy [passage...]
```

#### 1.2 Passage search REPL

This command opens a REPL environemt and logs each passage to the console.

```bash
bible
```

Example:
```
bible
> Matthew 4:4
  [4] But he answered, “It is written,

    “‘Man shall not live by bread alone,
        but by every word that comes from the mouth of God.’”
    

> col 3:2
  [2] Set your minds on things that are above, not on things that are on earth.
```

#### 1.2.1 Passage search REPL to clipboard

This command opens a REPL environment and copies each passage to the clipboard.

```bash
bible -c
```
```bash
bible --copy
```

#### 1.3 Set Translation

```bash
bible -t <translation>
```

Example: 
```ini
bible -t NASB gen 1:1
# => The Creation
#
# [1] In the beginning God created the heavens and the earth.
# Genesis 1:1 (New American Standard Bible)
```

### 2. 🔦 Lookup by keywords (e.g. For God so loved)

Default:
```bash
bible -r [keywords...]
```

Example:
```bash
bible -r for god so loved
# John 3:16 (New Living Translation)
# “For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.
#
# John 3:16 (New International Version)
# For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.
#
# John 3:16 (English Standard Version)
# For God So Loved the World “For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.
#
# John 3:16 (King James Version)
# For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.
#
# John 3:16 (Amplified Bible)
# “For God so [greatly] loved and dearly prized the world, that He [even] gave His [One and] only begotten Son, so that whoever believes and trusts in Him [as Savior] shall not perish, but have eternal life.
```

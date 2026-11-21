# ORION Linux (X11) input helper + its test probe. Needs libx11-dev libxtst-dev.
CC ?= cc
CFLAGS ?= -O2 -Wall -Wextra
OUT ?= build

all: $(OUT)/orion-input-x11 $(OUT)/input-probe-x11

$(OUT)/orion-input-x11: orion-input-x11.c
	@mkdir -p $(OUT)
	$(CC) $(CFLAGS) -o $@ $< -lX11 -lXtst

$(OUT)/input-probe-x11: input-probe-x11.c
	@mkdir -p $(OUT)
	$(CC) $(CFLAGS) -o $@ $< -lX11

clean:
	rm -rf $(OUT)

@echo off

git pull

git submodule update --init --remote GMS2-Robohelp-en/

start GameMakerManualTranslator.exe

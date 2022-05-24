# divekit-new-test-page-generator

## Nutzung

* Mit `node bin/generate-report` lässt sich der Testseitengenerator lokal ausführen. Dazu sollte vorher die vom
  Report-Mapper generierte Datei `unified.xml` im `target` Ordner abgelegt werden.

* Der Output des Testseitengenerator befindet sich im `public`-Ordner

* Für die Entwicklung kann mit `npm run dev` eine Demo-XML-Datei (siehe: `assets/xml-examples/`) genutzt werden.

* `npm run dev++` baut die Testseite auf basis der aktuell generierten Datei des `divekit-report-mapper`. Vorausetzung
  dabei ist das der `divekit-new-testpage-generator` im selben Ordner wie der `divekit-report-mapper` liegt.

## Changelog

### 1.0.1-beta.1
- Die Fehlermeldung bei Generierungsproblemen wurde aktualisiert, sodass diese auch angezeigt wird, wenn nur Teile der
  Testseite nicht generiert werden konnten.
- Es wurde ein Fehler behoben, bei welchem die Testseite nicht erzeugt werden konnte, sollte keinerlei input erfolgen

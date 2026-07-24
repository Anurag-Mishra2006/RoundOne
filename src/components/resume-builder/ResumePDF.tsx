import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import useResumeBuilderStore from '@/store/resumeBuilderStore';

const styles = StyleSheet.create({
  page: { padding: '24px 32px', fontFamily: 'Times-Roman', fontSize: 10, color: '#000', lineHeight: 1.3 },
  
  headerContainer: { textAlign: 'center', marginBottom: 10 },
  
  name: { fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  
  contactRow: { display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', fontSize: 9 },
  contactItem: { marginHorizontal: 4 },
  link: { color: 'blue', textDecoration: 'none' },

  sectionHeader: { fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2, marginBottom: 5, marginTop: 10 },
  
  rowBetween: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 1 },
  rowLeft: { display: 'flex', flexDirection: 'row', alignItems: 'baseline' },
  
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  
  bulletContainer: { display: 'flex', flexDirection: 'row', marginTop: 2, paddingLeft: 8, paddingRight: 8 },
  bullet: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, textAlign: 'justify' },

  skillRow: { display: 'flex', flexDirection: 'row', marginBottom: 2 },
  skillCategory: { fontWeight: 'bold', width: 160 }, 
  skillText: { flex: 1 }
});

export default function ResumePDF() {
  const state = useResumeBuilderStore();

  const renderSection = (sectionName: string) => {
    switch (sectionName) {
      
      case "education":
        if (!state.education || state.education.length === 0) return null;
        if (!state.education[0].institution) return null;
        
        return (
          <View key="edu" wrap={false}>
            <Text style={styles.sectionHeader}>Education</Text>
            {state.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 4 }}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.bold, { fontSize: 10.5 }]}>{edu.institution}</Text>
                  <Text style={styles.bold}>
                    {edu.type === "University" ? `${edu.startDate} – ${edu.endDate}` : `Year of Passing – ${edu.endDate}`}
                  </Text>
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.italic}>
                    {edu.degree} {edu.board ? `| Board: ${edu.board}` : ''} {edu.score ? `| ${edu.scoreType}: ${edu.score} / ${edu.maxScore}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        );

      case "coursework":
        if (!state.coursework || state.coursework.trim() === "") return null;
        return (
          <View key="course" wrap={false}>
            <Text style={styles.sectionHeader}>Relevant Coursework</Text>
            <Text style={{ paddingLeft: 8 }}>{state.coursework}</Text>
          </View>
        );

      case "experience":
        if (!state.experience || state.experience.length === 0) return null;
        if (!state.experience[0].company) return null;

        return (
          <View key="exp" wrap={false}>
            <Text style={styles.sectionHeader}>Experience</Text>
            {state.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 6 }}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.bold, { fontSize: 10.5 }]}>{exp.company}</Text>
                  <Text style={styles.bold}>{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</Text>
                </View>
                <Text style={[styles.italic, { marginBottom: 3 }]}>{exp.role}</Text>
                {exp.bullets.filter(b => b.trim() !== "").map((bullet, i) => (
                  <View key={i} style={styles.bulletContainer}>
                    <Text style={styles.bullet}>–</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );

      case "projects":
        if (!state.projects || state.projects.length === 0) return null;
        if (!state.projects[0].title) return null;

        return (
          <View key="proj" wrap={false}>
            <Text style={styles.sectionHeader}>Projects</Text>
            {state.projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 6 }}>
                <View style={styles.rowBetween}>
                  <View style={styles.rowLeft}>
                    <Text style={[styles.bold, { fontSize: 10.5 }]}>{proj.title} </Text>
                    {proj.techStack && <Text>| {proj.techStack}</Text>}
                  </View>
                  <Text style={styles.bold}>{proj.startDate} – {proj.endDate}</Text>
                </View>
                
                {(proj.githubUrl || proj.liveUrl) && (
                  <View style={{ display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 2 }}>
                    {proj.githubUrl && <Link src={proj.githubUrl} style={styles.link}>GitHub Link</Link>}
                    {proj.liveUrl && <Link src={proj.liveUrl} style={styles.link}>Live Demo</Link>}
                  </View>
                )}

                {proj.bullets.filter(b => b.trim() !== "").map((bullet, i) => (
                  <View key={i} style={styles.bulletContainer}>
                    <Text style={styles.bullet}>–</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );

      case "skills":
        const hasSkills = state.skills.some(skill => skill.category.trim() !== "" && skill.items.trim() !== "");
        if (!hasSkills) return null;

        return (
          <View key="skills" wrap={false}>
            <Text style={styles.sectionHeader}>Technical Skills</Text>
            <View style={{ paddingLeft: 8 }}>
              {state.skills.map(skill => (
                skill.category && skill.items && (
                  <View key={skill.id} style={styles.skillRow}>
                    <Text style={styles.skillCategory}>{skill.category}:</Text>
                    <Text style={styles.skillText}>{skill.items}</Text>
                  </View>
                )
              ))}
            </View>
          </View>
        );

      case "achievements":
        if (!state.achievements || state.achievements.length === 0) return null;
        if (!state.achievements[0].title) return null;

        return (
          <View key="ach" wrap={false}>
            <Text style={styles.sectionHeader}>Achievements and Competitive Programming</Text>
            {state.achievements.map((ach) => (
              <View key={ach.id} style={{ marginBottom: 4 }}>
                <View style={styles.rowLeft}>
                  <Text style={[styles.bold, { fontSize: 10 }]}>{ach.title} </Text>
                  {ach.subtitle && <Text>| {ach.subtitle} </Text>}
                  {ach.link && <Text>| <Link src={ach.link} style={styles.link}>Link</Link></Text>}
                </View>
                {ach.bullets.filter(b => b.trim() !== "").map((bullet, i) => (
                  <View key={i} style={styles.bulletContainer}>
                    <Text style={styles.bullet}>–</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  const p = state.personalInfo;
  
  const safeSectionOrder = [...new Set(state.sectionOrder)];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{p.fullName || "YOUR NAME"}</Text>
          
          {/* 2. Added marginTop and increased marginBottom to isolate the address from the name and the contact links */}
          {p.location && <Text style={{ marginTop: 2, marginBottom: 6 }}>{p.location}</Text>}
          
          <View style={styles.contactRow}>
            {p.phone && <Text style={styles.contactItem}>{p.phone}</Text>}
            {p.phone && p.email && <Text>|</Text>}
            {p.email && <Text style={styles.contactItem}>{p.email}</Text>}
            {p.email && p.linkedin && <Text>|</Text>}
            {p.linkedin && <Text style={styles.contactItem}><Link src={p.linkedin} style={styles.link}>LinkedIn</Link></Text>}
            {p.linkedin && p.github && <Text>|</Text>}
            {p.github && <Text style={styles.contactItem}><Link src={p.github} style={styles.link}>GitHub</Link></Text>}
            {p.github && p.portfolio && <Text>|</Text>}
            {p.portfolio && <Text style={styles.contactItem}><Link src={p.portfolio} style={styles.link}>Portfolio</Link></Text>}
          </View>
        </View>

        {/* Dynamic Body */}
        {safeSectionOrder.map((section) => renderSection(section))}

      </Page>
    </Document>
  );
}
